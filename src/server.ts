import express, { Request, Response } from 'express';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import { errorHandler } from './middleware/errorHandler';
import blogRoutes from './routes/blogRoutes';
import { connectToDatabase } from './db/connect';
import teamRoutes from './routes/teamRoutes';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());
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

async function startServer(): Promise<void> {
	try {
		await connectToDatabase();
		app.listen(port, () => {
			// eslint-disable-next-line no-console
			console.log(`Server listening on http://localhost:${port}`);
			// eslint-disable-next-line no-console
			console.log('MongoDB connected successfully');
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Failed to start server:', error);
		process.exit(1);
	}
}

void startServer();

// Centralized error handler
app.use(errorHandler);


