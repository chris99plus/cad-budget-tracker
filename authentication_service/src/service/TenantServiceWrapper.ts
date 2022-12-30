import { createServiceToken, makeServiceCallGet, makeServiceCallPost } from '../../../microservice_helpers';


/**
 * Interface which wraps functionality of the tenant microservice.
 */
export interface TenantServiceWrapper {
    validateTenantSecretAndGetTenantNameOrThrow(secret: string): Promise<string>;
    createNewTenantOrThrow(tenantName: string): Promise<void>;
}


export class TenantServiceWrapperImpl implements TenantServiceWrapper {
    tenantServiceUrl: string;

    constructor(tenantServiceUrl: string) {
        this.tenantServiceUrl = tenantServiceUrl;
    }

    async validateTenantSecretAndGetTenantNameOrThrow(secret: string): Promise<string> {
        let response = await makeServiceCallGet<any>(
            this.tenantServiceUrl,
            `/api/v1/tenants/${secret}`,
            createServiceToken()
        );

        return response?.tenant_name;
    }


    async createNewTenantOrThrow(tenantName: string): Promise<void> {
        await makeServiceCallPost<any>(
            this.tenantServiceUrl,
            `/api/v1/tenants`,
            {
                tenant_name: tenantName
            },
            createServiceToken()
        );
    }
}
