import express, { Request, Response } from 'express';
import { apiHandler, auth, getUserInformation } from '../../microservice_helpers';
import { TransactionModel } from './models/transactions';
import formidable, { Files } from 'formidable';
import { AzureBlobStorageFileSystem } from './service/AzureBlobStorageFileSystem';
import { isObjectIdOrHexString } from 'mongoose';
import { resolve } from 'path';

const router = express.Router();

function fileSystemFactory() {
    process.env.AZURE_BLOB_STORAGE_CONNECTION_STRING
    const connectionString = process.env.AZURE_BLOB_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_BLOB_STORAGE_CONTAINER_NAME;
    
    return new AzureBlobStorageFileSystem(
        connectionString,
        containerName
    );
}

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

    const form = formidable({ multiples: true });
    var result = await new Promise(function (resolve, reject) {
        form.parse(req, async function (err, fields, files) {
            const transactionData = fields;
            const newTransaction = new TransactionModel({
                amount: transactionData.amount,
                cashbookId: cashbookId,
                type: transactionData.type,
                description: transactionData.description,
                comment: transactionData.comment,
                timestamp: new Date(),
                category: transactionData.category
            });
            var result = await newTransaction.save();
    
            if(files.bill != null) {
                const fileSystem = fileSystemFactory();
                let content = files.bill as formidable.File;
                await fileSystem.storeUploadedFile(
                    content.filepath,
                    result._id.toString()
                )
                let url = await fileSystem.getBlobUrl(result._id.toString());
                const update = { url: url }
                const finalTransaction = await TransactionModel.findByIdAndUpdate(result._id, update, {
                    returnOriginal: false
                });
                resolve(finalTransaction);
                return;
            }
            resolve(result);
        });
    });
    return result;
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
