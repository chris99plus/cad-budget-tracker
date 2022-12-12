import { User, UserRepository } from "../data/UserRepository";
import { CreateUserRequest, CreateUserResponse } from "../requests/CreateUserRequest";
import { LoginRequest, LoginResponse } from "../requests/LoginRequest";
import { TenantServiceWrapper } from "./TenantServiceWrapper";
import { UserInformation } from "../../../microservice_helpers";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


/**
 * This service implements the authentication logic
 */
export class AuthenticationService {
    userRepository: UserRepository;
    tenantService: TenantServiceWrapper;

    constructor(userRepository: UserRepository, tenantService: TenantServiceWrapper) {
        this.userRepository = userRepository;
        this.tenantService = tenantService;
    }

    async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
        this.validateUserData(data);

        // TODO: Make the tenant creation and user creation one atomic operation.

        let tenantName = null;
        if (data.licenseType == "enterprise") {
            tenantName = await this.createTenantOrResolveSecret(data);
        }

        let passwordHash = await this.getPasswordHash(data.password);

        let createdUser = await this.userRepository.createUser(new User(
            data.username,
            data.email,
            data.licenseType,
            passwordHash,
            tenantName
        ));

        return {
            authToken: this.createJwt(createdUser)
        };
    }

    async createTenantOrResolveSecret(data: CreateUserRequest): Promise<string> {
        if (data.createTenant == false && data.tenantSecret != null) {
            return await this.tenantService.validateTenantSecretAndGetTenantNameOrThrow(
                data.tenantSecret
            );
        }
        else if (data.createTenant == true && data.tenantName != null) {
            await this.tenantService.createNewTenantOrThrow(
                data.tenantName
            );
            
            return data.tenantName;
        }
        else {
            throw `When licenceType='enterprise' createTenant must be true or false and tenantName or tenantSecret must be set`;
        }
    }

    async login(data: LoginRequest): Promise<LoginResponse> {
        let user = await this.userRepository.getUserByName(data.username);

        if (user == null) {
            throw "Wrong username or password";
        }

        let isPasswordCorrect = await this.isPasswordCorrect(data.password, user.passwordHash);

        if (isPasswordCorrect) {
            return {
                authToken: this.createJwt(user)
            };
        }
        else {
            throw "Wrong username or password";
        }
    }

    private validateUserData(data: CreateUserRequest) {
        if (!this.isPasswordValid(data.password)) {
            throw "This password is not allowed";
        }

        if (["free", "standard", "enterprise"].indexOf(data.licenseType) < 0) {
            throw "licenseType is invalid"
        }

        if (data.username.length < 1) {
            throw "The given username is too short";
        }

        // TODO: Validate if the email is correct
        // TODO: Validate if the user already exists
    }

    private async getPasswordHash(password: string): Promise<string> {
        let saltRounds = 8;
        return await bcrypt.hash(password, saltRounds);
    }

    private async isPasswordCorrect(enteredPassword: string, storedPasswordHash: string) {
        return await bcrypt.compare(enteredPassword, storedPasswordHash);
    }

    private isPasswordValid(password: string): boolean {
        let longEnough = password.length > 8;

        // TODO: Implement more password rules

        return longEnough;
    }

    private createJwt(user: User): string {
        var cashbookId = "";

        if(user.licenseType == "enterprise") {
            cashbookId = "tenant-name"; // TODO: Set the tenant name as soon as the tenant service is merged
        }
        else {
            cashbookId = user._id;
        }

        const token = jwt.sign(
            // Ugly but works. I want it to be a UserInformation in order
            // to guarantee type safety when using the JWT later.
            // See: https://stackoverflow.com/a/73075855/4563449
            JSON.parse(JSON.stringify(new UserInformation(
                user._id?.toString(),
                user.username,
                user.email,
                cashbookId
            ))),
            process.env.JWT_SECRET_KEY ?? "",
            {
                expiresIn: '2 days',
            }
        );

        return token;
    }
}
