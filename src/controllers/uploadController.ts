import { Request, Response } from 'express';
import multer from 'multer';
import { uploadImage as uploadToCloudinary } from '../utils/imageUpload';

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

// Configure storage to use memory storage for temporary file handling
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file extension
  const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
  if (!file.originalname.match(allowedExtensions)) {
    return cb(new Error('Only image files (JPG, JPEG, PNG, GIF, WebP) are allowed!'));
  }
  
  // Check MIME type
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed!'));
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
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded. Please select an image file.' 
      });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        success: false, 
        message: 'File size exceeds 5MB limit' 
      });
    }

    // Additional validation - check if buffer exists
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid file data' 
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer);
    
    return res.status(200).json({
      success: true,
      imageUrl: uploadResult.url,
      public_id: uploadResult.public_id,
      originalName: req.file.originalname,
      size: req.file.size,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error uploading file';
    
    // Handle specific Cloudinary errors
    if (errorMessage.includes('Cloudinary')) {
      return res.status(500).json({
        success: false,
        message: 'Image upload service error. Please try again.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};