import express from 'express';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import { transaction_router } from './api';
import { connectDatabase } from './db';
import * as swStats from "swagger-stats";

dotenv.config();

const app = express();
app.use(json());
app.use(swStats.getMiddleware({
    uriPath: '/swagger-stats'
}));
app.use(transaction_router);


const port = process.env.SERVER_PORT;

async function main() {
    await connectDatabase();

    app.listen(port, () => {
        console.log(`The transaction service is listening on port ${port}!`);
    });
}

main();
