import express from 'express';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import { report_router } from './api';
import { connectDatabase } from './db';
import { TransactionServiceWrapperImpl } from './service/TransactionServiceWrapper';
import { ReportService, getFirstDayOfWeek } from './service/ReportService';
//import { createWeeklyReports, getFirstDayOfWeek } from './reportCreator'
import { exit } from 'process';

dotenv.config();

const app = express();
app.use(json());
app.use(report_router);

const port = process.env.SERVER_PORT;

async function main() {
    await connectDatabase();

    if(process.env.EXECUTION_MODE == "service") {
        app.listen(port, () => {
            console.log(`The report service is listening on port ${port}!`);
        });
    } else if(process.env.EXECUTION_MODE == "cron-job") {
        const transactionServiceWrapper = new TransactionServiceWrapperImpl("http://localhost:4003")
        const reportService = new ReportService(transactionServiceWrapper);
        console.log("Service runs as cron-job to create weekly reports");
        const now = new Date();
        const monday = getFirstDayOfWeek(now);
        const startOfWeek = new Date(monday.getTime() - (7 * 24 * 60 * 60 * 1000));
        console.log("start of week: " + startOfWeek);
        console.log("end of week: " + monday);
        reportService.createWeeklyReports(startOfWeek, monday)
    }
}

main();
