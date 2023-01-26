import express from 'express';
import { MongooseUserRepository } from './data/MongooseUserRepository';
import { AuthenticationService } from './service/AuthenticationService';
import { apiHandler, auth, getUserInformation} from '../../microservice_helpers';
import { TenantServiceWrapperImpl } from './service/TenantServiceWrapper';
import * as dotenv from 'dotenv';
import * as swStats from "swagger-stats";


dotenv.config();

const port = process.env.SERVER_PORT ?? 4000;
const mongoDbConnectionString = process.env.MONGODB_CONNECTION_STRING ?? "";
const tenantServiceUrl = process.env.TENANT_SERVICE_URL ?? "";

const repository = new MongooseUserRepository(mongoDbConnectionString);
const tenantService = new TenantServiceWrapperImpl(tenantServiceUrl);
const authenticationService = new AuthenticationService(repository, tenantService);

const app = express();
app.use(express.json())
app.use(swStats.getMiddleware({
    uriPath: '/swagger-stats'
}));


app.post('/api/v1/auth/users', apiHandler(async (req, res) => {
    return await authenticationService.createUser(req.body);
}));

app.post('/api/v1/auth/login', apiHandler(async (req, res) => {
    return await authenticationService.login(req.body);
}));

app.get('/api/v1/auth/me', auth, apiHandler(async (req, res) => {
    let userInfo =  getUserInformation(req);
    if(userInfo != null)  {
        let user = await repository.getUserByName(userInfo.name);

        return {
            _id:user?._id,
            username:user?.username,
            email:user?.email,
            licenseType:user?.licenseType,
            tenantName:user?.tenantName,
        }
    }
    return null;
}));


async function main() {
    await repository.connect();

    app.listen(port, () => {
        console.log(`The authentication service is listening on port ${port}!`);
    });
}

main();