import express from 'express';
import { MongooseUserRepository } from './data/MongooseUserRepository';
import { AuthenticationService } from './service/AuthenticationService';
import * as dotenv from 'dotenv'

dotenv.config();

const port = process.env.SERVER_PORT ?? 4000;
const mongoDbConnectionString = process.env.MONGODB_CONNECTION_STRING ?? "";

const repository = new MongooseUserRepository(mongoDbConnectionString);
const authenticationService = new AuthenticationService(repository);

const app = express();
app.use(express.json())

app.post('/api/v1/auth/users', async (req, res) => {
    try {
        let result = await authenticationService.createUser(req.body);

        res.send({
            successful: true,
            data: result
        });
    }
    catch (err) {
        res.status(400).send({
            successful: false,
            message: err
        });
    }
});

app.post('/api/v1/auth/login', async (req, res) => {
    try {
        let result = await authenticationService.login(req.body);

        res.send({
            successful: true,
            data: result
        });
    }
    catch (err) {
        res.status(400).send({
            successful: false,
            message: err
        });
    }
});


async function main() {
    await repository.connect();

    app.listen(port, () => {
        console.log(`The service is listening on port ${port}!`);
    });
}

main();