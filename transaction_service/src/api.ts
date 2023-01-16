import express, { Request, Response } from 'express';
import { apiHandler, auth, getUserInformation } from '../../microservice_helpers';
import { TransactionModel } from './models/transactions';

const router = express.Router();

router.get('/api/v1/transactions', auth, apiHandler(async (req: Request, res: Response) => {
    let userInformation = getUserInformation(req);

    let cashbookId = userInformation?.cashbookId;

    if(cashbookId != null) {
        return await TransactionModel.find({'cashbookId':cashbookId});
    }
    else {
        return [];
    }
}));

router.post('/api/v1/transactions', auth, apiHandler(async (req: Request, res: Response) => {
    let userInformation = getUserInformation(req);
    let cashbookId = userInformation?.cashbookId;
    if(cashbookId == null) return;

    const transactionData = req.body;
    const newTransaction = new TransactionModel({
        amount: transactionData.amount,
        cashbookId: cashbookId,
        type: transactionData.type,
        description: transactionData.description,
        comment: transactionData.comment,
        timestamp: new Date(),
        category: transactionData.category
    });

    return await newTransaction.save();
}));

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


// TODO: Restrict permission to use this endpoint only from microservices
// Note: This endpoint may be used by a microservice that create configured repeative transactions (e.g. monthly income)
router.post('/api/v1/cashbooks/:cashbookId/transactions', auth, apiHandler(async (req: Request, res: Response) => {
    const transactionData = req.body;

    const newTransaction = new TransactionModel({
        amount: transactionData.amount,
        cashbookId: req.params.cashbookId,
        type: transactionData.type,
        description: transactionData.description,
        comment: transactionData.comment,
        timestamp: transactionData.timestamp,
        category: transactionData.category
    });

    return await newTransaction.save();
}));


// TODO: Restrict permission to use this endpoint only from microservices
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


// TODO: Restrict permission to use this endpoint only from microservices
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

router.get('/api/v1/cashbook/balance', auth, apiHandler(async (req: Request, res: Response) => {
    let userInformation = getUserInformation(req);

    let cashbookId = userInformation?.cashbookId;
    let income = 0;
    let expense = 0;
    let total = 0;
    if(cashbookId != null) {
        const pipeline = [{
            $match: {
                cashbookId: cashbookId
            }
        },
        {
            $group: {
                _id: "$type",
                value: {$sum: "$amount"}
            }
        }]
        
        const balance = await TransactionModel.aggregate(pipeline);
        console.log(balance);
        for(var transactionSum of balance) {
            if(transactionSum._id == "income") {
                income = transactionSum.value;
            } else if(transactionSum._id == "expense") {
                expense = transactionSum.value
            }
        }
        total = income - expense;  
    }
    return {
        total: total,
        income: income,
        expense: expense
    }
}));

export { router as transaction_router }
