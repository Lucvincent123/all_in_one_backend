import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface to include userId and email
declare global {
    namespace Express {
        interface Request {
            userId?: number;
            email?: string;
        }
    }
}

export function authorization(req: Request, res: Response, next: NextFunction): void {
    try {
        if (!req.headers['authorization']) {
            res.status(401).json({ message: 'No authorization header provided' });
            console.log('No authorization header provided');
            return;
        }
        const token = req.headers['authorization'].split(' ')[1]; // Assuming token is sent as "Bearer <token>"
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            console.log('No token provided');
            return;
        }
        jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Invalid token' });
                console.log('Invalid token');
                return;
            }
            const payload = decoded as { userId: number; email: string }; // Adjust according to your token payload
            console.log(payload);
            if (!payload || !payload.userId) {
                res.status(401).json({ message: 'Invalid token payload' });
                console.log('Invalid token payload');
                return;
            }
            // Attach user ID and email to the request object for further use
            req.userId = payload.userId; // Attach user ID to request object
            req.email = payload.email; // Attach email to request object if needed
            next();
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Authorization middleware error:', error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
