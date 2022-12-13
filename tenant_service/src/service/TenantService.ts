import { Tenant, TenantRepository } from "../data/TenantRepository";
import { CheckTenantResponse } from "../requests/CheckTenantStatusRequest";
import { CreateTenantRequest, CreateTenantResult } from "../requests/CreateTenantRequest";
import { GetTenantResponse } from "../requests/GetTenantResponse";
import * as randomstring from 'randomstring';


/**
 * This service implements the tenant creation logic
 */
export class TenantService {
    tenantRepository: TenantRepository;

    constructor(tenantRepository: TenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    async createTenant(data: CreateTenantRequest): Promise<CreateTenantResult> {
        if (data.tenant_name.length < 3) {
            throw "Tenant name too short";
        }

        // TODO: Trigger infrastructure scaling

        let secret = randomstring.generate({
            length: 12,
            charset: 'alphabetic'
        });

        await this.tenantRepository.createTenant(new Tenant(
            data.tenant_name,
            secret
        ));

        return {
            tenant_secret: secret
        };
    }


    async getTenantStatus(tenant_secret: string): Promise<CheckTenantResponse> {
        let tenant = await this.tenantRepository.getTenantBySecret(tenant_secret);

        if (tenant == null) {
            throw "Invalid tenant secret";
        }

        // TODO: Query tenant creation status

        return {
            status: "creating"
        };
    }


    async getTenantBySecret(tenant_secret: string): Promise<GetTenantResponse> {
        let tenant = await this.tenantRepository.getTenantBySecret(tenant_secret);

        if (tenant == null) {
            throw "Invalid tenant secret";
        }

        return {
            tenant_name: tenant.name
        };
    }
}
