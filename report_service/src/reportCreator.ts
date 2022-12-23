import { TransactionModel } from "./models/transactions"

interface incomeTransactions {
    name:    string;
    age:     number;
    created: string;
  }

const secondPipelineStage = {
    $group: {
        _id: "$category",
        value: {$sum: "$amount"}
    }
};

async function getIncomeReport(cashbookId:any, start:Date, end:Date) {
    const pipelineIncomeReport = [
        {
            $match: {
                cashbookId: cashbookId,
                timestamp: {$gte: start, $lte: end},
                type: "income"
        } },
        secondPipelineStage
    ];
    return await TransactionModel.aggregate(pipelineIncomeReport);
}

async function getExpensesReport(cashbookId:any, start:Date, end:Date) {
    const pipelineExpenseReport = [
        {
            $match: {
                cashbookId: cashbookId,
                timestamp: {$gte: start, $lte: end},
                type: "expense"
        } },
        secondPipelineStage
    ];
    return await TransactionModel.aggregate(pipelineExpenseReport);
}

async function getReportTransactions(cashbook:any, start:Date, end:Date) {
    console.log(cashbook);
    console.log(start);
    console.log(end);
    return {
        "income": await getIncomeReport(cashbook, start, end),
        "expenses": await getExpensesReport(cashbook, start, end)
    }
    
    /*const expenses = TransactionModel.aggregate(pipelineExpensesReport);
    return {
        "income": income,
        "expenses": expenses
    }*/
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