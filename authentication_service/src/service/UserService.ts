import { User, UserRepository } from "../data/UserRepository";
import { isPasswordValid } from "../logic/PasswordValidator";
import { CreateUserRequest, CreateUserResponse } from "../requests/CreateUserRequest";
import { LoginRequest, LoginResponse } from "../requests/LoginRequest";

export class UserService {
    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
        if(!isPasswordValid(data.password)) {
            throw "This password is not allowed";
        }

        if(["free", "standard", "enterprise"].indexOf(data.licenseType) < 0) {
            throw "licenseType is invalid"
        }

        if(data.username.length < 1) {
            throw "The given username is too short";
        }

        // TODO: More validation -> email
        // TODO: Validate if the user already exists

        await this.userRepository.createUser(new User(
            data.username,
            data.email,
            data.licenseType,
            data.password // TODO: Hash password
        ));

        // TODO: Create JWT

        return {
            authToken: "t0ken"
        };
    }

    async login(data: LoginRequest): Promise<LoginResponse> {
        let user = await this.userRepository.getUserByName(data.username);

        if(user == null) {
            throw "Wrong username or password";
        }

        if(user.passwordHash == data.password) {
            
            // TODO: Create JWT

            return {
                authToken: "t0ken"
            };
        }
        else {
            throw "Wrong username or password";
        }        
    }
}
