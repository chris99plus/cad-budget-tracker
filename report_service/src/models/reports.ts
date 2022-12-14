import mongoose from "mongoose";


const reportsSchema = new mongoose.Schema({
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

const ReportModel = mongoose.model('Reports', reportsSchema, 'reports');

export { ReportModel }
