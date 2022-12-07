import express from 'express';
import mongoose from 'mongoose';
import { json } from 'body-parser'
import dotenv from 'dotenv'
dotenv.config();

import { transaction_router } from './api';

const port = 4000;

const app = express();
app.use(json());
app.use(transaction_router);

const mongoUrl = "fill this out"

mongoose.connect(mongoUrl, () => {
    console.log('Connected to Database')
})

const db = mongoose.connection;


app.listen(process.env.PORT, () => {
    console.log(`The service is listening on port ${process.env.PORT}!`);
});

export { db }