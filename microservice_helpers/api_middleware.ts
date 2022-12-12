import { Request, Response } from 'express';


/**
 * This function can be used to wrap api code. It automatically sends the correct 
 * status code and response format.
 * 
 * You can return error messages like so: throw "Error message"
 */
export const apiHandler = (fn: (req: Request, res: Response) => Promise<any>) => (req: Request, res: Response) => {
    fn(req, res)
        .then(data =>
            res.send({
                successful: true,
                data: data
            })
        )
        .catch(err => {
            console.log(err);
            res.status(400).send({
                successful: false,
                message: err
            })
        }
        );
};
