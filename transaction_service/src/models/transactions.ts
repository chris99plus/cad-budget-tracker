import { time } from "console";
import mongoose from "mongoose";

enum TransactionType {
    income = "income",
    expense = "expense"
}

const transactionSchema = new mongoose.Schema({
    amount: Number,
    type: String,
    description: String,
    comment: String,
    timestamp: Date,
    category: String
})

const Transaction = mongoose.model('Transaction', transactionSchema, 'transactions')

export { Transaction }