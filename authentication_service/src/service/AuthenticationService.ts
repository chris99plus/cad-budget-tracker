import { User, UserRepository } from "../data/UserRepository";
import { CreateUserRequest, CreateUserResponse } from "../requests/CreateUserRequest";
import { LoginRequest, LoginResponse } from "../requests/LoginRequest";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const SECRET_KEY = "Y!lC6r15O@$PzJqVzZ&7P2B9!JquUfKh0f*oJE^1$U!^4!h5ZK";


/**
 * This service implements the authentication logic
 */
export class AuthenticationService {
    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
        this.validateUserData(data);

        let passwordHash = await this.getPasswordHash(data.password);

        let createdUser = await this.userRepository.createUser(new User(
            data.username,
            data.email,
            data.licenseType,
            passwordHash
        ));

        return {
            authToken: this.createJwt(createdUser)
        };
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
        const token = jwt.sign(
            {
                _id: user._id?.toString(),
                name: user.username,
                email: user.email
            },
            SECRET_KEY,
            {
                expiresIn: '2 days',
            }
        );

        return token;
    }
}
