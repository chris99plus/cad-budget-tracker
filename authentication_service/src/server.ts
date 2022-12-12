import express from 'express';
import { MongooseUserRepository } from './data/MongooseUserRepository';
import { AuthenticationService } from './service/AuthenticationService';
import { apiHandler, auth, getUserInformation } from '../../microservice_helpers';
import * as dotenv from 'dotenv';

dotenv.config();

const port = process.env.SERVER_PORT ?? 4000;
const mongoDbConnectionString = process.env.MONGODB_CONNECTION_STRING ?? "";

const repository = new MongooseUserRepository(mongoDbConnectionString);
const authenticationService = new AuthenticationService(repository);

const app = express();
app.use(express.json())

app.post('/api/v1/auth/users', apiHandler(async (req, res) => {
    return await authenticationService.createUser(req.body);
}));

app.post('/api/v1/auth/login', apiHandler(async (req, res) => {
    return await authenticationService.login(req.body);
}));

app.get('/api/v1/auth/me', auth, apiHandler(async (req, res) => {
    return getUserInformation(req);
}));


async function main() {
    await repository.connect();

    app.listen(port, () => {
        console.log(`The service is listening on port ${port}!`);
    });
}

main();