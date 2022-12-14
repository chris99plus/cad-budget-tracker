import express from 'express';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import { report_router } from './api';
import { connectDatabase } from './db';

dotenv.config();

const app = express();
app.use(json());
app.use(report_router);

const port = process.env.SERVER_PORT;

async function main() {
    await connectDatabase();

    app.listen(port, () => {
        console.log(`The report service is listening on port ${port}!`);
    });
}

main();
