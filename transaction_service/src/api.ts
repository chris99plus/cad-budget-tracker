import express, {Request, Response} from 'express';
import { Transaction } from './models/transactions';
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()

const endpointPrefix = "/api/" + process.env.API_VERSION
console.log("API Version " + process.env.API_VERSION)

router.get(endpointPrefix + '/', (req: Request, res: Response) => {
    res.send('Well done!');
});

router.get(endpointPrefix + '/transactions', (req: Request, res: Response) => {
    Transaction.find({}).then( function(allTransactions) {
        console.log(allTransactions);
        res.status(200).send(allTransactions);
    });
})

router.post(endpointPrefix + '/transactions', (req: Request, res: Response) => {
    console.log(req.body);
    var newTransaction = new Transaction({
        amount: req.body.amount, type: req.body.type,
        description: req.body.description, comment: req.body.comment,
        timestamp: req.body.timestamp, category: req.body.category
    })
    newTransaction.save(function (err, transaction) {
        if (err) { 
            console.error(err);
            res.status(500);
        }
      });
    return res.status(200).send(req.body);
});

export { router as transaction_router}