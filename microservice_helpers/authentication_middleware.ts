import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Decipher } from 'crypto';

export interface AuthenticatedRequest extends Request {
    user: UserInformation | null;
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

        const decoded = <any>jwt.verify(
            token,
            process.env.JWT_SECRET_KEY ?? ""
        );

        (req as AuthenticatedRequest).user = new UserInformation(
            decoded._id,
            decoded.name,
            decoded.email,
            decoded.cashbookId
        );

        next();
    } catch (err) {
        res.status(403).send({
            successful: false,
            error: "Please authenticate"
        });
    }
};


export class UserInformation {
    _id: string;
    name: string;
    email: string;
    cashbookId: string;

    constructor(id: string, name: string, email: string, cashbookId: string) {
        this._id = id;
        this.name = name;
        this.email = email;
        this.cashbookId = cashbookId;
    }
}

export function getUserInformation(req: Request): UserInformation|null {
    if(req.hasOwnProperty("user")) {
        return (req as AuthenticatedRequest).user ?? null;
    }
    else {
        return null;
    }
}
