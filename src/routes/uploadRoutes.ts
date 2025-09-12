import { Router } from 'express';
import { uploadImage, uploadMiddleware } from '../controllers/uploadController';

const router = Router();

// Route for uploading images
router.post('/', uploadMiddleware, uploadImage);

export default router;