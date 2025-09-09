import path from 'path';
import dotenv from 'dotenv';

const envFilePath = path.resolve(process.cwd(), '.env',);
dotenv.config({ path: envFilePath });

const mongoDbUrl =
	process.env.MONGODB_URI ||
	process.env.MONGODB_URL ||
	process.env.MONGO_URI ||
	process.env.MANGODB_URL ||
	'';

const mongoDbDbName = process.env.MONGODB_DB || '';

if (!mongoDbUrl) {
	// eslint-disable-next-line no-console
	console.warn('Mongo URL is not set. Expected MONGODB_URI (preferred), MONGODB_URL or MANGODB_URL in src/.env');
}

if (mongoDbUrl.includes('<db_password>') || /<.*?>/.test(mongoDbUrl)) {
	throw new Error('Your MongoDB URL still has placeholder values (e.g., <db_password>). Replace them with real credentials.');
}

// Basic validation for common SRV mistakes that cause ENOTFOUND
try {
	const parsed = new URL(mongoDbUrl);
	const isSrv = parsed.protocol === 'mongodb+srv:';
	if (isSrv) {
		if (!mongoDbUrl.includes('@')) {
			throw new Error('Malformed MongoDB SRV URI: missing credentials segment (expected user:pass@host).');
		}
		// Atlas SRV hosts typically end with .mongodb.net
		if (!parsed.hostname || !parsed.hostname.includes('.')) {
			throw new Error(`Malformed MongoDB SRV URI host: "${parsed.hostname}". Expected a valid domain like cluster0.xxxxx.mongodb.net`);
		}
		if (!/mongodb\.net$/i.test(parsed.hostname)) {
			// Not strictly required, but helps catch accidental JWT/password in host
			// eslint-disable-next-line no-console
			console.warn(`MongoDB SRV host "${parsed.hostname}" does not look like an Atlas hostname (expected *.mongodb.net). Proceeding...`);
		}
	}
} catch (e) {
	throw new Error(`Invalid MongoDB URL. ${e instanceof Error ? e.message : String(e)}`);
}

export const appConfig = {
	mongoDbUrl,
	mongoDbDbName,
	jwtSecret: process.env.JWT_SECRET ?? '',
};


