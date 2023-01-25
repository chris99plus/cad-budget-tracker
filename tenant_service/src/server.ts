import express from 'express';
import { MongooseTenantRepository } from './data/MongooseTenantRepository';
import { TenantService } from './service/TenantService';
import { apiHandler, auth } from '../../microservice_helpers';
import * as fs from 'fs'
import { InfrastructureController } from './infrastructure/InfrastructureController';
import * as dotenv from 'dotenv';
import * as swStats from "swagger-stats";

dotenv.config();

const port = process.env.SERVER_PORT ?? 4000;
const mongoDbConnectionString = process.env.MONGODB_CONNECTION_STRING ?? "";

const repository = new MongooseTenantRepository(mongoDbConnectionString);
const tenantService = new TenantService(repository);

let controller = new InfrastructureController(repository);

let token = fs.readFileSync("/var/run/secrets/kubernetes.io/serviceaccount/token", "utf8");
let namespace = fs.readFileSync("/var/run/secrets/kubernetes.io/serviceaccount/namespace", "utf8");
let cacertPath = "/var/run/secrets/kubernetes.io/serviceaccount/ca.crt";

const app = express();
app.use(express.json());
app.use(swStats.getMiddleware({
    uriPath: '/swagger-stats'
}));

app.post('/api/v1/tenants', auth, apiHandler(async (req, res) => {
    return await tenantService.createTenant(req.body);
}));

app.get('/api/v1/tenants/:tenant_secret/status', auth, apiHandler(async (req, res) => {
    return await tenantService.getTenantStatus(req.params.tenant_secret);
}));

app.get('/api/v1/tenants/:tenant_secret', auth, apiHandler(async (req, res) => {
    return await tenantService.getTenantBySecret(req.params.tenant_secret);
}));

app.post('/api/v1/infrastructure/update', auth, apiHandler(async (req, res) => {
    return await controller.updateInfrastructure(namespace);
}));

async function main() {
    await repository.connect();

    app.listen(port, async () => {
        console.log(`The tenant service is listening on port ${port}!`);

        await controller.configureKubectl(token, cacertPath);
        await controller.createFreeTierInfrastructure(namespace);
        await controller.createPremiumTierInfrastructure(namespace);
    });
}

main();
