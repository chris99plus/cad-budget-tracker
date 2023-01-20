import express, { Request, Response } from 'express';
import { apiHandler, auth, getUserInformation } from '../../microservice_helpers';
import { ReportModel } from './models/reports';
import { ReportService, getFirstDayOfWeek, getFirstDayOfMonth } from './service/ReportService';
import { TransactionServiceWrapperImpl } from './service/TransactionServiceWrapper';

const router = express.Router()

const transactionServiceWrapper = new TransactionServiceWrapperImpl(process.env.TRANSACTION_SERVICE_URL);
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

router.get('/api/v1/reports/weekly/current', auth, apiHandler(async (req: Request, res: Response) => {
    let userInformation = getUserInformation(req);
    let cashbookId = userInformation?.cashbookId;
    if(cashbookId == null) return;
    
    var now = new Date();

    var firstDayOfWeek = getFirstDayOfWeek(new Date());
    const report = reportService.createReport(cashbookId, firstDayOfWeek, now);
    return await report;
}));

router.get('/api/v1/reports/monthly/current', auth, apiHandler(async (req: Request, res: Response) => {
    let userInformation = getUserInformation(req);
    let cashbookId = userInformation?.cashbookId;
    if(cashbookId == null) return;
    
    var now = new Date();

    var firstDayOfMonth = getFirstDayOfMonth(new Date());
    const report = reportService.createReport(cashbookId, firstDayOfMonth, now);
    return await report;
}));

router.get('/api/v1/reports/weekly/all', auth, apiHandler(async (req: Request, res: Response) => {
    let userInformation = getUserInformation(req);
    let cashbookId = userInformation?.cashbookId;
    if(cashbookId == null) return;

    return await ReportModel.find({"cashbookId": cashbookId});
}));


router.delete('/api/v1/reports/:reportId', auth, apiHandler(async (req: Request, res: Response) => {
    await ReportModel.findByIdAndDelete(req.params.rerportId);
    return {};
}));

export { router as report_router }
