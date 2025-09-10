import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
    console.error('Error:', err);
    
    // Don't send error details in production
    const isProd = process.env.NODE_ENV === 'production';
    
    if (err instanceof Error) {
        const status = 
            /not found/i.test(err.message) ? 404 :
            /validation|images/i.test(err.message) ? 400 :
            /timeout/i.test(err.message) ? 408 :
            500;
            
        res.status(status).json({
            error: {
                message: err.message,
                ...(isProd ? {} : { stack: err.stack })
            }
        });
    } else {
        res.status(500).json({
            error: {
                message: 'Internal Server Error'
            }
        });
    }
}


