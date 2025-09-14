import { Router, Request, Response, NextFunction } from 'express';
import { uploadImage, uploadMiddleware } from '../controllers/uploadController';
import multer from 'multer';

const router = Router();

// Error handling middleware for multer
const handleMulterError = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 5MB limit'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name. Use "image" as the field name.'
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'File upload error'
    });
  }
  
  next();
};

// Route for uploading images
router.post('/', uploadMiddleware, handleMulterError, uploadImage);

// Test endpoint to check if upload service is working
router.get('/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Upload service is running',
    timestamp: new Date().toISOString()
  });
});

export default router;