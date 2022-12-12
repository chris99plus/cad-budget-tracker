import express, { Request, Response } from 'express';
import { apiHandler, auth } from '../../microservice_helpers';
import { TransactionModel } from './models/transactions';

const router = express.Router()

router.get('/api/v1/transactions', auth, apiHandler(async (req: Request, res: Response) => {
    return await TransactionModel.find({});
}));

router.get('/api/v1/transactions/:transactionId', auth, apiHandler(async (req: Request, res: Response) => {
    let transaction = await TransactionModel.findById(req.params.transactionId);

    if (transaction == null) {
        throw "Transaction not found."
    }

    return transaction;
}));

router.post('/api/v1/transactions', auth, apiHandler(async (req: Request, res: Response) => {
    const transactionData = req.body;

    const newTransaction = new TransactionModel({
        amount: transactionData.amount,
        type: transactionData.type,
        description: transactionData.description,
        comment: transactionData.comment,
        timestamp: transactionData.timestamp,
        category: transactionData.category
    });

    return await newTransaction.save();
}));

router.delete('/api/v1/transactions/:transactionId', auth, apiHandler(async (req: Request, res: Response) => {
    await TransactionModel.findByIdAndDelete(req.params.transactionId);
    return {};
}));

export { router as transaction_router }
