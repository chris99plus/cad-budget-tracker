import express from 'express';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import { transaction_router } from './api';
import { databaseConnection } from './db';
import cors from "cors";

dotenv.config();

const app = express();
app.use(json());
const corsOptions ={
    origin:['http://localhost:3000'], 
    credentials:true,            
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(transaction_router);



databaseConnection();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`The service is listening on port ${port}!`);
});