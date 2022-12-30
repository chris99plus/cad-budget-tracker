import express from 'express';
import { MongooseTenantRepository } from './data/MongooseTenantRepository';
import { TenantService } from './service/TenantService';
import { apiHandler, auth } from '../../microservice_helpers';
import * as dotenv from 'dotenv'

dotenv.config();

const port = process.env.SERVER_PORT ?? 4000;
const mongoDbConnectionString = process.env.MONGODB_CONNECTION_STRING ?? "";

const repository = new MongooseTenantRepository(mongoDbConnectionString);
const tenantService = new TenantService(repository);

const app = express();
app.use(express.json())

app.post('/api/v1/tenants', auth, apiHandler(async (req, res) => {
    return await tenantService.createTenant(req.body);
}));

app.get('/api/v1/tenants/:tenant_secret/status', auth, apiHandler(async (req, res) => {
    return await tenantService.getTenantStatus(req.params.tenant_secret);
}));

app.get('/api/v1/tenants/:tenant_secret', auth, apiHandler(async (req, res) => {
    return await tenantService.getTenantBySecret(req.params.tenant_secret);
}));

async function main() {
    await repository.connect();

    app.listen(port, () => {
        console.log(`The tenant service is listening on port ${port}!`);
    });
}

main();
