import mongoose from "mongoose";
import "../reportCreator"


interface category {
    name: String,
    value: number,
    percent: number
}

interface subreport {
    total: number,
    categories: category[]
}

interface Report {
    cashbookId: string,
    start: Date,
    end: Date,
    total: number,
    income: subreport,
    expenses: subreport
}

const reportsSchema = new mongoose.Schema<Report>({
    cashbookId: String,
    start: Date,
    end: Date,
    total: Number,
    income: {
        total: Number,
        categories: [{name: String, value: Number, percent: Number}]
    },
    expenses: {
        total: Number,
        categories: [{name: String, value: Number, percent: Number}]
    }
}, {
    versionKey: false
});

const ReportModel = mongoose.model('Reports', reportsSchema, 'reports');

export { ReportModel }
