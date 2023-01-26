import { Tenant, TenantRepository } from "../data/TenantRepository";
import { CreateTenantRequest, CreateTenantResult } from "../requests/CreateTenantRequest";
import { GetTenantResponse } from "../requests/GetTenantResponse";
import * as randomstring from 'randomstring';
import { InfrastructureController } from "../infrastructure/InfrastructureController";


/**
 * This service implements the tenant creation logic
 */
export class TenantService {
    tenantRepository: TenantRepository;
    infrastructureController: InfrastructureController;

    constructor(tenantRepository: TenantRepository, infrastructureController: InfrastructureController) {
        this.tenantRepository = tenantRepository;
        this.infrastructureController = infrastructureController;
    }

    async createTenant(data: CreateTenantRequest): Promise<CreateTenantResult> {
        if (data.tenant_name.length < 3) {
            throw "Tenant name too short";
        }

        this.infrastructureController.createEnterpriseInfrastructure(
            data.tenant_name
        )

        console.log("Created tenant infrastructure");

        let secret = randomstring.generate({
            length: 12,
            charset: 'alphabetic'
        });

        console.log("Created tenant secret: " + secret);

        const tenant = await this.tenantRepository.createTenant(new Tenant(
            data.tenant_name,
            secret
        ));

        console.log("Created tenant in db");
        console.log(JSON.stringify(tenant));

        return {
            tenant_secret: secret,
            tenant_domain: ""
        };
    }

    async getTenantBySecret(tenant_secret: string): Promise<GetTenantResponse> {
        let tenant = await this.tenantRepository.getTenantBySecret(tenant_secret);

        if (tenant == null) {
            throw "Invalid tenant secret";
        }

        return {
            tenant_name: tenant.name,
            tenant_domain: tenant.getDomain()
        };
    }
}
