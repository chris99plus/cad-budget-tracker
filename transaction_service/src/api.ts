import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import { Transaction } from './models/transactions';
import { db } from './server'; 

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
    res.send('Well done!');
});

router.get('/transactions', (req: Request, res: Response) => {
    Transaction.find({}).then( function(allTransactions) {
        console.log(allTransactions);
        res.status(200).send(allTransactions);
    });
})

router.post('/transactions', (req: Request, res: Response) => {
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