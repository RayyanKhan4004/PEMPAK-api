// import mongoose from 'mongoose';
// import { appConfig } from '../config/env';

// export async function connectToDatabase(): Promise<void> {
// 	const { mongoDbUrl, mongoDbDbName } = appConfig;
// 	if (!mongoDbUrl) {
// 		throw new Error('Missing MongoDB URL in environment configuration');
// 	}

// 	await mongoose.connect(mongoDbUrl, {
// 		// dbName is optional; use if provided or if the URI lacks it
// 		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// 		// @ts-ignore - types allow string | undefined but this keeps it explicit
// 		dbName: mongoDbDbName || undefined,
// 	});

// 	mongoose.connection.on('connected', () => {
// 		// eslint-disable-next-line no-console
// 		console.log('MongoDB connected');
// 	});

// 	mongoose.connection.on('error', (error) => {
// 		// eslint-disable-next-line no-console
// 		console.error('MongoDB connection error:', error);
// 	});
// }


// src/db/connect.ts
import mongoose from 'mongoose';
import { appConfig } from '../config/env';

declare global {
  // allow caching in global for re-use during hot reloads
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<typeof mongoose> | undefined;
}

const mongoUri = appConfig.mongoDbUrl;

export async function connectToDatabase(): Promise<void> {
  if (!mongoUri) {
    // log and return (do not throw); routes can handle lack of DB gracefully
    console.warn('connectToDatabase: MONGO URI not configured');
    return;
  }

  // reuse existing connection
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!global.__mongoClientPromise) {
    global.__mongoClientPromise = mongoose.connect(mongoUri);
  }
  await global.__mongoClientPromise;
}
