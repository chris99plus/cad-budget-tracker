import express from 'express';
import { json } from 'body-parser'
import dotenv from 'dotenv'
import { transaction_router } from './api';
import { databaseConnection } from './db'

dotenv.config();

const app = express();
app.use(json());
app.use(transaction_router);

databaseConnection();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`The service is listening on port ${port}!`);
});