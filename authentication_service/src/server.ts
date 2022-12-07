import express from 'express';
import { mainModule } from 'process';
import { MongooseUserRepository } from './data/MongooseUserRepository';
import { UserService } from './service/UserService';

const port = 4000;

const app = express();

app.use(express.json())

const repository = new MongooseUserRepository("mongodb://localhost:27017/authentication");

const userService = new UserService(repository);


app.post('/api/v1/auth/users', async (req, res) => {
    console.log(req.body);

    res.send(await userService.createUser(req.body));
});

app.post('/api/v1/auth/login', async (req, res) => {
    res.send(await userService.login(req.body));
});


async function main() {
    await repository.connect();

    app.listen(port, () => {
        console.log(`The service is listening on port ${port}!`);
    });
}

main();