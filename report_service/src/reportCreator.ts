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

async function getTransactionsGrouped(cashbookId:any, start:Date, end:Date, type:string) {
    const pipelineExpenseReport = [
        {
            $match: {
                cashbookId: cashbookId,
                timestamp: {$gte: start, $lte: end},
                type: type
        } },
        secondPipelineStage
    ];
    return await TransactionModel.aggregate(pipelineExpenseReport);
}

async function getReportTransactions(cashbook:any, start:Date, end:Date) {
    console.log(cashbook);
    console.log(start);
    console.log(end);
    const actualStart = new Date("2022-12-23T00:00:00.000Z");
    const actualEnd = new Date("2022-12-23T17:16:15.514Z");
    const income = await getTransactionsGrouped(cashbook, actualStart, actualEnd, "income");
    const expenses  = await getTransactionsGrouped(cashbook, actualStart, actualEnd, "expense");
    const incomeSubReport = await createSubReport(income);
    const expensesSubReport = await createSubReport(expenses);
    return {total: incomeSubReport.total-expensesSubReport.total, income: incomeSubReport, expenses: expensesSubReport}

}

interface category {
    name: String,
    value: number,
    percent: number
}

interface subreport {
    total: number,
    categories: category[]
}

interface report {
    total: number,
    income: subreport,
    expenses: subreport
}


async function createSubReport(groupedTransactions: any) {
    let total = Number(0);
    for(let i in groupedTransactions) {
        console.log(groupedTransactions[i]._id)
        total = total + Number(groupedTransactions[i].value);
    }
    console.log(total);
    let categories = [];    
    for(let j in groupedTransactions) {
        groupedTransactions[j];
        categories.push({
            name: groupedTransactions[j]._id,
            value: groupedTransactions[j].value,
            percent: groupedTransactions[j].value/total
        });
    }
    return {total: total, categories: categories};
}

export async function createReport(cashbookId:any, start:Date, end:Date) {
    const transactionsOfReport = getReportTransactions(cashbookId, start, end);
    /*const incomeTransactions[];
    (await transactionsOfReport).forEach(element => {
        
    });*/
    console.log(transactionsOfReport);
    return await transactionsOfReport;
}