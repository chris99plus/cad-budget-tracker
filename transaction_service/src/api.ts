import express, { Request, Response } from 'express';
import { apiHandler, auth } from '../../microservice_helpers';
import { TransactionModel } from './models/transactions';
import { on } from 'stream';

const router = express.Router();

router.get('/api/v1/transactions/:transactionId', auth, apiHandler(async (req: Request, res: Response) => {
    let transaction = await TransactionModel.findById(req.params.transactionId);

    if (transaction == null) {
        throw "Transaction not found."
    }

    return transaction;
}));

router.delete('/api/v1/transactions/:transactionId', auth, apiHandler(async (req: Request, res: Response) => {
    await TransactionModel.findByIdAndDelete(req.params.transactionId);
    return {};
}));


router.post('/api/v1/cashbooks/:cashbookId/transactions', auth, apiHandler(async (req: Request, res: Response) => {
    const transactionData = req.body;

    const newTransaction = new TransactionModel({
        amount: transactionData.amount,
        cashbookId: transactionData.cashbookId,
        type: transactionData.type,
        description: transactionData.description,
        comment: transactionData.comment,
        timestamp: transactionData.timestamp,
        category: transactionData.category
    });

    return await newTransaction.save();
}));


router.get('/api/v1/cashbooks/:cashbookId/transactions', auth, apiHandler(async (req: Request, res: Response) => {
    const cashbookId = req.params.cashbookId;
    const start = req.query.start;
    const end = req.query.end;
    const type = req.query.type;
    var query = {};
    if(start == null || end == null) {
        if(type == null) {
            query = {'cashbookId':cashbookId };
        } else {
            query = {'cashbookId':cashbookId, 'type': type }
        }  
    } else if(type == null) {
        query = {'cashbookId':cashbookId, timestamp: {$gte: start, $lte: end}};
    } else {
        query = {'cashbookId':cashbookId, timestamp: {$gte: start, $lte: end}, 'type': type}
    }
    return await TransactionModel.find(query);
}));

router.get('/api/v1/cashbooks/cashbookIds', auth,  apiHandler(async (req: Request, res: Response) => {
    var cashbooks = await TransactionModel.aggregate([
        {
            $group: {
                _id: "$cashbookId"
            }
        }
    ]);
    var cashbookIds:string[] = [];
    for(var oneCashbook of cashbooks) {
        cashbookIds.push(oneCashbook._id);
    }
    return cashbookIds;
}));

export { router as transaction_router }
