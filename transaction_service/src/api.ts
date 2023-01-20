import express, { Request, Response } from 'express';
import { apiHandler, auth, getUserInformation } from '../../microservice_helpers';
import { TransactionModel } from './models/transactions';
import formidable from 'formidable';
import { AzureBlobStorageFileSystem } from './service/AzureBlobStorageFileSystem';
import mongoose from 'mongoose';

const router = express.Router();

function fileSystemFactory() {
    return new AzureBlobStorageFileSystem(
        process.env.AZURE_BLOB_STORAGE_CONNECTION_STRING,
        process.env.AZURE_BLOB_STORAGE_CONTAINER_NAME
    );
}

const fileSystem = fileSystemFactory();


router.get('/api/v1/transactions', auth, apiHandler(async (req: Request, res: Response) => {
    let userInformation = getUserInformation(req);

    let cashbookId = userInformation?.cashbookId;

    if (cashbookId != null) {
        return await TransactionModel.find({ 'cashbookId': cashbookId });
    }
    else {
        return [];
    }
}));

router.post('/api/v1/transactions', auth, apiHandler(async (req: Request, res: Response) => {
    let userInformation = getUserInformation(req);
    let cashbookId = userInformation?.cashbookId;
    if (cashbookId == null) return;

    const form = formidable({ multiples: true });

    var result = await new Promise(function (resolve, reject) {
        form.parse(req, async function (err: any, fields: any, files: any) {
            let newTransactionId = new mongoose.Types.ObjectId();
            var billImageUrl: string | null = null;

            if (files.billImage != null) {
                let billImageFile = files.billImage as formidable.File;

                await fileSystem.storeUploadedFile(
                    billImageFile.filepath,
                    newTransactionId.toString()
                );

                billImageUrl = await fileSystem.getBlobUrl(
                    newTransactionId.toString()
                );
            }

            const transactionData = fields;
            const newTransaction = new TransactionModel({
                _id: newTransactionId,
                amount: transactionData.amount,
                cashbookId: cashbookId,
                type: transactionData.type,
                description: transactionData.description,
                comment: transactionData.comment,
                timestamp: transactionData.timestamp,
                category: transactionData.category,
                billImageUrl: billImageUrl
            });
            var result = await newTransaction.save();

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
    if (start == null || end == null) {
        if (type == null) {
            query = { 'cashbookId': cashbookId };
        } else {
            query = { 'cashbookId': cashbookId, 'type': type }
        }
    } else if (type == null) {
        query = { 'cashbookId': cashbookId, timestamp: { $gte: start, $lte: end } };
    } else {
        query = { 'cashbookId': cashbookId, timestamp: { $gte: start, $lte: end }, 'type': type }
    }
    return await TransactionModel.find(query);
}));


// TODO: Restrict permission to use this endpoint only from microservices
router.get('/api/v1/cashbooks/cashbookIds', auth, apiHandler(async (req: Request, res: Response) => {
    var cashbooks = await TransactionModel.aggregate([
        {
            $group: {
                _id: "$cashbookId"
            }
        }
    ]);
    var cashbookIds: string[] = [];
    for (var oneCashbook of cashbooks) {
        cashbookIds.push(oneCashbook._id);
    }
    return cashbookIds;
}));

router.get('/api/v1/cashbook/balance', auth, apiHandler(async (req: Request, res: Response) => {
    let userInformation = getUserInformation(req);

    let cashbookId = userInformation?.cashbookId;

    if (cashbookId == null) {
        return [];
    }

    const pipeline = [{
        $match: {
            cashbookId: cashbookId
        }
    },
    {
        $group: {
            _id: "$type",
            value: { $sum: "$amount" }
        }
    }]

    const balance = await TransactionModel.aggregate(pipeline);

    let income = 0;
    let expense = 0;

    for (var transactionSum of balance) {
        if (transactionSum._id == "income") {
            income = transactionSum.value;
        } else if (transactionSum._id == "expense") {
            expense = transactionSum.value
        }
    }

    return {
        total: income - expense,
        income: income,
        expense: expense
    }
}));

export { router as transaction_router }
