
export class User {
    username: string;
    email: string;
    licenseType: string;
    passwordHash: string;

    constructor(username: string, email: string, licenseType: string, passwordHash: string) {
        this.username = username;
        this.email = email;
        this.licenseType = licenseType;
        this.passwordHash = passwordHash;
    }
}

export interface UserRepository {
    createUser(user: User): Promise<void>;
    getUserByName(username: string): Promise<User|null>;
}
