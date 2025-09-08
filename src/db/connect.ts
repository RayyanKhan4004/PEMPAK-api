import mongoose from 'mongoose';
import { appConfig } from '../config/env';

export async function connectToDatabase(): Promise<void> {
	const { mongoDbUrl, mongoDbDbName } = appConfig;
	if (!mongoDbUrl) {
		throw new Error('Missing MongoDB URL in environment configuration');
	}

	await mongoose.connect(mongoDbUrl, {
		// dbName is optional; use if provided or if the URI lacks it
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore - types allow string | undefined but this keeps it explicit
		dbName: mongoDbDbName || undefined,
	});

	mongoose.connection.on('connected', () => {
		// eslint-disable-next-line no-console
		console.log('MongoDB connected');
	});

	mongoose.connection.on('error', (error) => {
		// eslint-disable-next-line no-console
		console.error('MongoDB connection error:', error);
	});
}


