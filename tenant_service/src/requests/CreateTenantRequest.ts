export interface CreateTenantRequest {
    tenant_name: string;
}

export interface CreateTenantResult {
    tenant_secret: string;
    tenant_domain: string;
}
