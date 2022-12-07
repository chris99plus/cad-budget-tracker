import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { SECRET_KEY } from './service/AuthenticationService';

export interface AuthenticatedRequest extends Request {
    token: string | JwtPayload;
}


/**
 * Middleware function which can be used to secure endpoints needing authentication
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        (req as AuthenticatedRequest).token = decoded;

        next();
    } catch (err) {
        res.status(403).send('Please authenticate');
    }
};
