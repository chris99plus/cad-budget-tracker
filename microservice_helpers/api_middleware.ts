import { Request, Response } from 'express';


export const apiHandler = (fn: (req: Request, res: Response) => Promise<any>) => (req: Request, res: Response) => {
    fn(req, res)
        .then(data =>
            res.send({
                successful: true,
                data: data
            })
        )
        .catch(err =>
            res.status(400).send({
                successful: false,
                error: err
            })
        );
};
