import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import { errorHandler } from './middleware/errorHandler';
import blogRoutes from './routes/blogRoutes';
import { connectToDatabase } from './db/connect';
import teamRoutes from './routes/teamRoutes';
import uploadRoutes from './routes/uploadRoutes';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? '*' // Replace with your actual production domain
    : '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

connectToDatabase()
  .then(() => console.log('Mongo connected (module load)'))
  .catch((err) => console.error('Mongo connect error (module load):', err));
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Start the server in development mode
// Server is now started at the top of the file for development mode

// Add timeout middleware
app.use((req, res, next) => {
  // Set timeout to 8 seconds (Vercel's limit is 10s)
  req.setTimeout(8000);
  res.setTimeout(8000);
  next();
});

// Add basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json({ limit: '1mb' }));
// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/teams', teamRoutes);
console.log('Registering upload route...');
app.use('/api/upload', uploadRoutes);



app.get('/health', (_req: Request, res: Response) => {
  return res.status(200).json({ status: 'ok' });
});

app.get('/', (_req: Request, res: Response) => {
  return res.send('Express server is running (TypeScript)');
});

// Centralized error handler
app.use(errorHandler);

// Server is now started at the top of the file for development mode

app.get('/api/debug', (_req, res) => {
  res.json({
    ok: true,
    nodeEnv: process.env.NODE_ENV,
    hasMongoUri: !!process.env.MONGODB_URI || !!process.env.MONGO_URI,
    jwtPresent: !!process.env.JWT_SECRET
  });
});

// Export the Express app for Vercel
export default app;