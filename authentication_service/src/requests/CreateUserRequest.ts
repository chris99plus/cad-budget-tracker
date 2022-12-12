export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    licenseType: string
}

export interface CreateUserResponse {
    authToken: string
}
