import express, {Request, Response} from 'express';
import { Transaction } from './models/transactions';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
dotenv.config()

const router = express.Router()


router.get('/api/v1/', (req: Request, res: Response) => {
    res.send('Well done!');
});

router.get('/api/v1/transactions', (req: Request, res: Response) => {
    Transaction.find({}).then( function(allTransactions) {
        return res.status(200).send({successful: true, data: allTransactions});
    }).catch(err => {
        return res.status(400).send({successful: false, message: err});
    });
});

router.get('/api/v1/transactions/:transactionId', (req: Request, res: Response) => {
    Transaction.findById(req.params.transactionId).then(transaction => {
        if(transaction === null) { return res.status(400).send({successful: false, message: "Transaction not found."});}
        return res.status(200).send({successful: true, data: transaction});
    }).catch(err => {
        return res.status(400).send({successful: false, message: err});
    });
});

router.post('/api/v1/transactions', (req: Request, res: Response) => {
    const transactionData = req.body;
    var newTransaction = new Transaction({
        amount: transactionData.amount, type: transactionData.type,
        description: transactionData.description, comment: transactionData.comment,
        timestamp: transactionData.timestamp, category: transactionData.category
    })
    newTransaction.save().then(createdTransaction => {
        createdTransaction._id.toString;
        return res.status(200).send({successful: true, data: createdTransaction});
    }).catch(err => {
        return res.status(400).send({successful: false, message: err});
    });
});

router.delete('/api/v1/transactions/:transactionId', (req: Request, res: Response) => {
    Transaction.findByIdAndDelete(req.params.transactionId).then(transaction => {
        if(transaction === null) { return res.status(400).send({successful: false, message: "Transaction not found"});}
        return res.status(200).send({successful: true, data: transaction});
    }).catch(err => {
        console.log(err)
        return res.status(400).send({successful: false, message: err});
    });
});

export { router as transaction_router}