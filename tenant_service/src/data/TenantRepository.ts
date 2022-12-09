
/**
 * Data model for a tenant
 */
export class Tenant {
    _id: any|null;
    name: string;
    tenant_secret: string;

    constructor(name: string, tenant_secret: string) {
        this.name = name;
        this.tenant_secret = tenant_secret;
    }
}

/**
 * Repository to access tenants in the database
 */
export interface TenantRepository {
    createTenant(tenant: Tenant): Promise<Tenant>;
    getTenantBySecret(tenant_secret: string): Promise<Tenant|null>;
}
