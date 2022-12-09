import express from 'express';
import { MongooseTenantRepository } from './data/MongooseTenantRepository';
import { TenantService } from './service/TenantService';
import * as dotenv from 'dotenv'

dotenv.config();

const port = process.env.SERVER_PORT ?? 4000;
const mongoDbConnectionString = process.env.MONGODB_CONNECTION_STRING ?? "";

const repository = new MongooseTenantRepository(mongoDbConnectionString);
const tenantService = new TenantService(repository);

const app = express();
app.use(express.json())

app.post('/api/v1/tenants', async (req, res) => {
    try {
        let result = await tenantService.createTenant(req.body);

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

app.get('/api/v1/tenants/:tenant_secret/status', async (req, res) => {
    try {
        let result = await tenantService.getTenantStatus(req.params.tenant_secret);

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

app.get('/api/v1/tenants/:tenant_secret', async (req, res) => {
    try {
        let result = await tenantService.getTenantBySecret(req.params.tenant_secret);

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
