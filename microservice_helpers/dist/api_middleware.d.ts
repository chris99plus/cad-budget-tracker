import { Request, Response } from 'express';
/**
 * This function can be used to wrap api code. It automatically sends the correct
 * status code and response format.
 *
 * You can return error messages like so: throw "Error message"
 */
export declare const apiHandler: (fn: (req: Request, res: Response) => Promise<any>) => (req: Request, res: Response) => void;
