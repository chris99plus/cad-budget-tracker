export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    authToken: string;
    tenantDomain: string;
    hostDomain: string;
}
