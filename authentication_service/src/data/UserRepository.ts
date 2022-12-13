
/**
 * Data model for a user
 */
export class User {
    _id: any | null;
    username: string;
    email: string;
    licenseType: string;
    passwordHash: string;
    tenantName: string | null;

    constructor(username: string, email: string, licenseType: string, passwordHash: string, tenantName: string | null) {
        this._id = null;
        this.username = username;
        this.email = email;
        this.licenseType = licenseType;
        this.passwordHash = passwordHash;
        this.tenantName = tenantName;
    }
}

/**
 * Repository to access users in the database
 */
export interface UserRepository {
    createUser(user: User): Promise<User>;
    getUserByName(username: string): Promise<User | null>;
}
