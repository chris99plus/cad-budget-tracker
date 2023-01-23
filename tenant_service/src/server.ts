import express from 'express';
import { MongooseTenantRepository } from './data/MongooseTenantRepository';
import { TenantService } from './service/TenantService';
import { apiHandler, auth } from '../../microservice_helpers';
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import { InfrastructureController } from './infrastructure/InfrastructureController';

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

    app.listen(port, async () => {
        console.log(`The tenant service is listening on port ${port}!`);

        let controller = new InfrastructureController(repository);

        let token = fs.readFileSync("/var/run/secrets/kubernetes.io/serviceaccount/token", "utf8");
        let namespace = fs.readFileSync("/var/run/secrets/kubernetes.io/serviceaccount/namespace", "utf8");
        let cacertPath = "/var/run/secrets/kubernetes.io/serviceaccount/ca.crt";

        await controller.configureKubectl(token, cacertPath);
        await controller.createTenantInfrastructure("free");
    });
}

main();
