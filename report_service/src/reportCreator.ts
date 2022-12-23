import { TransactionModel } from "./models/transactions"

interface incomeTransactions {
    name:    string;
    age:     number;
    created: string;
  }

async function getReportTransactions(cashbook:any, start:Date, end:Date) {
    console.log(cashbook);
    console.log(start);
    console.log(end);
    /*return await TransactionModel.find({
        cashbookId: {$in: cashbookId},
        timestamp: {$gte: start, $lte: end}
    })*/
    const firstPipelineStage_Incomes = {$match: {
        cashbookId: {$in: cashbook},
        timestamp: {$gte: start, $lte: end},
        type: {$in: "expense"}
    } };

    const pipeline = [
        {$match: {
            cashbookId: cashbook,
            timestamp: {$gte: start, $lte: end},
            type: "expense"
        } },
        {
            $group: {
                _id: "$category",
                value: {$sum: "$amount"}
            }
        }
    ];
    return await TransactionModel.aggregate(pipeline);
    /*
    const incomeTransactions = {};
    categoriesIncome.forEach(category => {
        const transactionsOfCategory = TransactionModel.aggregate([
            firstPipelineStage_Incomes,
            {
                $match: { category: {$in: category._id}}
            }
        ])
        incomeTransactions
    });*/
}

export async function createReport(cashbookId:any, start:Date, end:Date) {
    const transactionsOfReport = getReportTransactions(cashbookId, start, end);
    /*const incomeTransactions[];
    (await transactionsOfReport).forEach(element => {
        
    });*/
    console.log(transactionsOfReport);
    return await transactionsOfReport;
}