import { createServiceToken, makeServiceCallGet, makeServiceCallPost } from '../../../microservice_helpers';


/**
 * Interface which wraps functionality of the tenant microservice.
 */
export interface TenantServiceWrapper {
    validateTenantSecretAndGetTenantNameOrThrow(secret: string): Promise<GetTenantResponse>;
    createNewTenantOrThrow(tenantName: string): Promise<CreateTenantResponse | null>;
}

export interface CreateTenantResponse {
    tenant_secret: string;
    tenant_domain: string;
}

export interface GetTenantResponse {
    tenant_name: string;
    tenant_domain: string;
}


export class TenantServiceWrapperImpl implements TenantServiceWrapper {
    tenantServiceUrl: string;

    constructor(tenantServiceUrl: string) {
        this.tenantServiceUrl = tenantServiceUrl;
    }

    async validateTenantSecretAndGetTenantNameOrThrow(secret: string): Promise<GetTenantResponse> {
        return await makeServiceCallGet<GetTenantResponse>(
            this.tenantServiceUrl,
            `/api/v1/tenants/${secret}`,
            createServiceToken()
        );
    }


    async createNewTenantOrThrow(tenantName: string): Promise<CreateTenantResponse | null> {
        return await makeServiceCallPost<CreateTenantResponse>(
            this.tenantServiceUrl,
            `/api/v1/tenants`,
            {
                tenant_name: tenantName
            },
            createServiceToken()
        );
    }
}
