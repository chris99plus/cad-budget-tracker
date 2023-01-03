import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
    amount: Number,
    cashbookId: String,
    type: String,
    description: String,
    comment: String,
    timestamp: Date,
    category: String
}, {
    versionKey: false
});

const TransactionModel = mongoose.model('Transaction', transactionSchema, 'transactions');

export { TransactionModel }
