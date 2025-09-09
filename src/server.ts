import express, { Request, Response } from 'express';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import { errorHandler } from './middleware/errorHandler';
import blogRoutes from './routes/blogRoutes';
import { connectToDatabase } from './db/connect';
import teamRoutes from './routes/teamRoutes';

const app = express();
connectToDatabase()
  .then(() => console.log('Mongo connected (module load)'))
  .catch((err) => console.error('Mongo connect error (module load):', err));
// const port = process.env.PORT ? Number(process.env.PORT) : 3000;

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
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/teams', teamRoutes);



app.get('/health', (_req: Request, res: Response) => {
  return res.status(200).json({ status: 'ok' });
});

app.get('/', (_req: Request, res: Response) => {
  return res.send('Express server is running (TypeScript)');
});

// Centralized error handler
app.use(errorHandler);

// if (process.env.NODE_ENV !== 'production') {
//   async function startServer(): Promise<void> {
//     try {
//       await connectToDatabase();
//       app.listen(port, '0.0.0.0', () => {
//         console.log(`Server listening on http://0.0.0.0:${port}`);
//         console.log('MongoDB connected successfully');
//       });
//     } catch (error) {
//       console.error('Failed to start server:', error);
//       process.exit(1);
//     }
//   }
//   void startServer();
// }

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