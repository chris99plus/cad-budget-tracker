import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user: UserInformation | null;
}
/**
 * Middleware function which can be used to secure endpoints needing authentication.
 * Note that the JWT_SECRET_KEY environment variable must be set.
 */
export declare const auth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare class UserInformation {
    _id: string;
    name: string;
    email: string;
    cashbookId: string;
    constructor(id: string, name: string, email: string, cashbookId: string);
}
export declare function getUserInformation(req: Request): UserInformation | null;
