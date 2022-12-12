import express from 'express';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import { transaction_router } from './api';
import { connectDatabase } from './db';

dotenv.config();

const app = express();
app.use(json());
app.use(transaction_router);

connectDatabase();

const port = process.env.SERVER_PORT;

app.listen(port, () => {
    console.log(`The service is listening on port ${port}!`);
});
