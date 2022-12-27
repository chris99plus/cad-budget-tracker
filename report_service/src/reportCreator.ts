import { ReportModel } from "./models/reports";
import { TransactionModel } from "./models/transactions"



const secondPipelineStage = {
    $group: {
        _id: "$category",
        value: {$sum: "$amount"}
    }
};

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


async function createSubReport(groupedTransactions: any) {
    let total = Number(0);
    for(let i in groupedTransactions) {
        total = (total + Number(groupedTransactions[i].value));
    }
    let categories = [];    
    for(let j in groupedTransactions) {
        groupedTransactions[j];
        categories.push({
            name: groupedTransactions[j]._id,
            value: (groupedTransactions[j].value).toFixed(2),
            percent: ((groupedTransactions[j].value/total)*100).toFixed(2)
        });
    }
    return {total: total.toFixed(2), categories: categories};
}

export async function createReport(cashbookId:any, start:Date, end:Date) {
    const actualStart = new Date("2022-12-23T00:00:00.000Z");
    const actualEnd = new Date("2022-12-23T17:16:15.514Z");
    const income = await getTransactionsGrouped(cashbookId, actualStart, actualEnd, "income");
    const expenses  = await getTransactionsGrouped(cashbookId, actualStart, actualEnd, "expense");
    const incomeSubReport = await createSubReport(income);
    const expensesSubReport = await createSubReport(expenses);
    var total = Number(incomeSubReport.total)-Number(expensesSubReport.total);
    return {total: (Math.round(total * 100) / 100).toFixed(2), income: incomeSubReport, expenses: expensesSubReport}
}

export async function createWeeklyReports(start:Date, end:Date) {
    const pipelineCashbookIds = [
        {
            $group: {
                _id: "$cashbookId"
        } },
    ];
    const cashbookIds = await TransactionModel.aggregate(pipelineCashbookIds);
    var newReports = [];
    for(let i in cashbookIds) {
        const currentCashbook = cashbookIds[i]._id;
        var newReportData = await createReport(currentCashbook, start, end);
        console.log(newReportData);
        const newReport = new ReportModel({
            cashbookId: currentCashbook,
            start: start,
            end: end,
            total: newReportData.total,
            income: newReportData.income,
            expenses: newReportData.expenses
        })
        const newReportEntry = await newReport.save();
        newReports.push({cashbookId: currentCashbook, _id: newReportEntry._id})
    }
    return newReports;
}

export function getFirstDayOfWeek(d: Date) {
    d.setUTCHours(0, 0, 0, 0);
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1);
  return new Date(d.setDate(diff))
}