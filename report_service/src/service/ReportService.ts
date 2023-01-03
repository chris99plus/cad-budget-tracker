import { ReportModel } from "../models/reports";
import { TransactionServiceWrapper } from "./TransactionServiceWrapper";

export class ReportService {
    transactionService: TransactionServiceWrapper;
    secondPipelineStage: any;

    constructor(transactionService: TransactionServiceWrapper) {
        this.transactionService = transactionService;
        this.secondPipelineStage = {
            $group: {
                _id: "$category",
                value: {$sum: "$amount"}
            }
        };
    }

    async createReport(cashbookId:any, start:Date, end:Date) {
        const transactionsOfReport = await this.getGroupedTransactions(cashbookId, start, end);
        const incomeSubReport = await this.createSubReport(transactionsOfReport.income);
        const expensesSubReport = await this.createSubReport(transactionsOfReport.expenses);
        var total = Number(incomeSubReport.total)-Number(expensesSubReport.total);
        return {total: (Math.round(total * 100) / 100).toFixed(2), income: incomeSubReport, expenses: expensesSubReport}
    }

    async createSubReport(groupedTransactions: any) {
        var total:number = 0;
        var categoryReports = [];
        for (var category in groupedTransactions) {
            const categoryTransactions = groupedTransactions[category];
            var categoryTotal:number = 0;
            for (let i in categoryTransactions) {
                categoryTotal = categoryTotal + categoryTransactions[i].amount;
            }
            total = total + categoryTotal
            categoryReports.push({"name": category, "value": Number(categoryTotal.toFixed(2)), "percent": 0})
        };
        for (var i in categoryReports) {
            categoryReports[i].percent = Number(((categoryReports[i].value/total)*100).toFixed(2));
        }
        return {"total": total, "categories": categoryReports}
    }

    async getGroupedTransactions(cashbookId: any, start: any, end: any) {
        const incomeTransactionsGrouped = this.groupByCategory(
            await this.transactionService.getTransactionsByCashbookTimestampsAndType(cashbookId, start, end, "income"));
        const expenseTransactionsGrouped = this.groupByCategory(
            await this.transactionService.getTransactionsByCashbookTimestampsAndType(cashbookId, start, end, "expense"));
        return {"income": incomeTransactionsGrouped, "expenses": expenseTransactionsGrouped}
    }

    groupByCategory(transactions: any) {
        const result = transactions.reduce(function (r: any, a: any) {
            r[a.category] = r[a.category] || [];
            r[a.category].push(a);
            return r;
        }, Object.create(null));
        return result;
        
    }
    async createWeeklyReports(start:Date, end:Date) {
        const cashbookIds = await this.transactionService.getCashbookIdsOfTransactions();
        var newReports = [];
        for(let currentCashbook of cashbookIds) {
            var newReportData = await this.createReport(currentCashbook, start, end);
            
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
}

export function getFirstDayOfWeek(d: Date) {
    d.setUTCHours(0, 0, 0, 0);
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1);
  return new Date(d.setDate(diff))
}