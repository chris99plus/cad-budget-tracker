import express, { Request, Response } from 'express';
import { apiHandler, auth } from '../../microservice_helpers';
import { ReportModel } from './models/reports';
import { createReport } from './reportCreator';

const router = express.Router()


router.get('/api/v1/report/daily/today', apiHandler(async (req: Request, res: Response) => {
    const now = new Date();
    const beginOfToday = new Date();
    beginOfToday.setUTCHours(0,0,0,0);
    const transactions = createReport(req.query.cashbookId, beginOfToday, now);
    return await transactions;
}));

router.get('/api/v1/report/daily', apiHandler(async (req: Request, res: Response) => {
    // TODO
}));

router.get('/api/v1/report/weekly/current', apiHandler(async (req: Request, res: Response) => {
    // TODO
}));

router.get('/api/v1/report/weekly', apiHandler(async (req: Request, res: Response) => {
    // TODO
}));


router.delete('/api/v1/reports/:reportId', auth, apiHandler(async (req: Request, res: Response) => {
    await ReportModel.findByIdAndDelete(req.params.rerportId);
    return {};
}));

export { router as report_router }
