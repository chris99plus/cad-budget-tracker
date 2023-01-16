import express, { Request, Response } from 'express';
import { apiHandler, auth, getUserInformation } from '../../microservice_helpers';
import { ReportModel } from './models/reports';
import { ReportService, getFirstDayOfWeek } from './service/ReportService';
import { TransactionServiceWrapperImpl } from './service/TransactionServiceWrapper';

const router = express.Router()

const transactionServiceUrl = process.env.TRANSACTION_SERVICE_URL ?? "";

const transactionServiceWrapper = new TransactionServiceWrapperImpl(transactionServiceUrl)
const reportService = new ReportService(transactionServiceWrapper);


router.get('/api/v1/reports/daily/:day', auth, apiHandler(async (req: Request, res: Response) => {
    let userInformation = getUserInformation(req);
    let cashbookId = userInformation?.cashbookId;
    if(cashbookId == null) return;

    var day = req.params.day;
    var beginOfDay = new Date();
    var endOfDay = new Date();
    if(day == "today") {
        beginOfDay.setUTCHours(0,0,0,0);
    } else if(new Date(day) > beginOfDay) {
        throw "The day of which the daily report is requested is in the future."
    } 
    else {
        beginOfDay = new Date(day);
        beginOfDay.setUTCHours(0,0,0,0);
        endOfDay = new Date(beginOfDay.getTime() + (24 * 60 * 60 * 1000));
    }
    const report = await reportService.createReport(cashbookId, beginOfDay, endOfDay);
    return report;
}));

router.get('/api/v1/cashbooks/:cashbookId/reports/weekly/current', auth, apiHandler(async (req: Request, res: Response) => {
    var now = new Date();
    var firstDayOfWeek = getFirstDayOfWeek(now);
    const report = reportService.createReport(req.params.cashbookId, firstDayOfWeek, now);
    return await report;
}));

router.get('/api/v1/cashbooks/:cashbookId/reports/weekly', auth, apiHandler(async (req: Request, res: Response) => {
    return await ReportModel.find({"cashbookId": req.params.cashbookId});
}));


router.delete('/api/v1/reports/:reportId', auth, apiHandler(async (req: Request, res: Response) => {
    await ReportModel.findByIdAndDelete(req.params.rerportId);
    return {};
}));

export { router as report_router }
