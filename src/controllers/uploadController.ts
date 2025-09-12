import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Add this to make Express.Multer.File available
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }
  }
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use a path that works in both development and production
    const uploadDir = process.env.NODE_ENV === 'production'
      ? path.join(process.cwd(), 'uploads') // For production
      : path.join(__dirname, '../../uploads'); // For development
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new Error('Only image files are allowed!'));
  }
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter
});

// Upload middleware
export const uploadMiddleware = upload.single('image');

// Upload handler
export const uploadImage = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Get the file path
    const file = req.file;
    
    // Determine the base URL for the file
    let baseUrl: string;
    if (process.env.NODE_ENV === 'production') {
      // For production, use the API_URL environment variable or default to the Vercel URL
      baseUrl = process.env.API_URL || 
               (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://pempak-api.vercel.app');
    } else {
      // For development, use the host from the request
      baseUrl = `http://${req.headers.host}`;
    }

    // Return the file URL
    const imageUrl = `${baseUrl}/uploads/${file.filename}`;
    
    return res.status(200).json({
      success: true,
      imageUrl,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading file'
    });
  }
};