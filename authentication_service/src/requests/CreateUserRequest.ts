export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    licenseType: string;
    createTenant: boolean | null;
    tenantSecret: string | null;
    tenantName: string | null;
}

export interface CreateUserResponse {
    authToken: string;
    tenantDomain: string;
    hostDomain: string;
}
