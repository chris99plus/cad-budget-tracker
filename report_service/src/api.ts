import express, { Request, Response } from 'express';
import { apiHandler, auth } from '../../microservice_helpers';
import { ReportModel } from './models/reports';

import { ReportService, getFirstDayOfWeek } from './service/ReportService';
import { TransactionServiceWrapperImpl } from './service/TransactionServiceWrapper';

const router = express.Router()

const transactionServiceWrapper = new TransactionServiceWrapperImpl("http://localhost:4003")
const reportService = new ReportService(transactionServiceWrapper);


router.get('/api/v1/reports/daily/today', apiHandler(async (req: Request, res: Response) => {
    var now = new Date();
    var beginOfToday = new Date();
    beginOfToday.setUTCHours(0,0,0,0);
    const report = await reportService.createReport(req.query.cashbookId, beginOfToday, now);
    return await report;
}));

router.get('/api/v1/reports/daily', apiHandler(async (req: Request, res: Response) => {
    // TODO
    const cashbookId = req.query.cashbookId;
    return reportService.getGroupedTransactions(cashbookId, req.query.start, req.query.end);
}));

router.get('/api/v1/reports/weekly/current', apiHandler(async (req: Request, res: Response) => {
    var now = new Date();
    var firstDayOfWeek = getFirstDayOfWeek(now);
    const report = reportService.createReport(req.query.cashbookId, firstDayOfWeek, now);
    return await report;
}));

router.get('/api/v1/reports/weekly', apiHandler(async (req: Request, res: Response) => {
    // TODO
}));

router.post('/api/v1/reports/weekly', apiHandler(async (req: Request, res: Response) => {
    return await reportService.createWeeklyReports(new Date("2022-12-24T17:16:15.514Z"), new Date());
}));


router.delete('/api/v1/reports/:reportId', auth, apiHandler(async (req: Request, res: Response) => {
    await ReportModel.findByIdAndDelete(req.params.rerportId);
    return {};
}));

export { router as report_router }
