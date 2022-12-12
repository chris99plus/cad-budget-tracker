import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
    token: string | JwtPayload;
}


/**
 * Middleware function which can be used to secure endpoints needing authentication.
 * Note that the JWT_SECRET_KEY environment variable must be set.
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY ?? ""
        );
        (req as AuthenticatedRequest).token = decoded;

        next();
    } catch (err) {
        res.status(403).send({
            successful: false,
            error: "Please authenticate"
        });
    }
};
