import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
	const message = err instanceof Error ? err.message : 'Internal Server Error';
	const status = /not found/i.test(message) ? 404 : /validation|images/i.test(message) ? 400 : 500;
	res.status(status).json({ message });
}


