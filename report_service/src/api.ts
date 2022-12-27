import express, { Request, Response } from 'express';
import { apiHandler, auth } from '../../microservice_helpers';
import { ReportModel } from './models/reports';
import { createReport, createWeeklyReports, getFirstDayOfWeek } from './reportCreator';

const router = express.Router()


router.get('/api/v1/reports/daily/today', apiHandler(async (req: Request, res: Response) => {
    var now = new Date();
    var beginOfToday = new Date();
    beginOfToday.setUTCHours(0,0,0,0);
    const report = createReport(req.query.cashbookId, beginOfToday, now);
    return await report;
}));

router.get('/api/v1/reports/daily', apiHandler(async (req: Request, res: Response) => {
    // TODO
}));

router.get('/api/v1/reports/weekly/current', apiHandler(async (req: Request, res: Response) => {
    var now = new Date();
    var firstDayOfWeek = getFirstDayOfWeek(now);
    const report = createReport(req.query.cashbookId, firstDayOfWeek, now);
    return await report;
}));

router.get('/api/v1/reports/weekly', apiHandler(async (req: Request, res: Response) => {
    // TODO
}));

router.post('/api/v1/reports/weekly', apiHandler(async (req: Request, res: Response) => {
    return await createWeeklyReports(new Date("2022-12-24T17:16:15.514Z"), new Date());
}));


router.delete('/api/v1/reports/:reportId', auth, apiHandler(async (req: Request, res: Response) => {
    await ReportModel.findByIdAndDelete(req.params.rerportId);
    return {};
}));

export { router as report_router }
