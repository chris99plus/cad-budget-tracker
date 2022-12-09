import express, { Request, Response } from 'express';
import { TransactionModel } from './models/transactions';

const router = express.Router()


router.get('/api/v1/transactions', async (req: Request, res: Response) => {
    try {
        let allTransactions = await TransactionModel.find({});

        res.send({
            successful: true,
            data: allTransactions
        });
    }
    catch (err) {
        res.status(400).send({
            successful: false,
            message: err
        });
    }
});

router.get('/api/v1/transactions/:transactionId', async (req: Request, res: Response) => {
    try {
        let transaction = await TransactionModel.findById(req.params.transactionId);

        if (transaction == null) {
            throw "Transaction not found."
        }

        res.send({
            successful: true,
            data: transaction
        });
    }
    catch (err) {
        res.status(400).send({
            successful: false,
            message: err
        });
    }
});

router.post('/api/v1/transactions', async (req: Request, res: Response) => {
    try {
        const transactionData = req.body;

        const newTransaction = new TransactionModel({
            amount: transactionData.amount,
            type: transactionData.type,
            description: transactionData.description,
            comment: transactionData.comment,
            timestamp: transactionData.timestamp,
            category: transactionData.category
        });

        let createdTransaction = await newTransaction.save();

        res.send({
            successful: true,
            data: createdTransaction
        });
    }
    catch (err) {
        res.status(400).send({
            successful: false,
            message: err
        });
    }
});

router.delete('/api/v1/transactions/:transactionId', async (req: Request, res: Response) => {
    try {
        await TransactionModel.findByIdAndDelete(req.params.transactionId);

        res.send({
            successful: true,
            data: {}
        });
    }
    catch (err) {
        res.status(400).send({
            successful: false,
            message: err
        });
    }
});

export { router as transaction_router }
