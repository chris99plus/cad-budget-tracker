import mongoose, { Schema } from "mongoose";
import { User, UserRepository } from "./UserRepository";

const userSchema = new Schema<User>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    licenseType: { type: String, required: true },
    passwordHash: { type: String, required: true }
});

const UserModel = mongoose.model('User', userSchema);


export class MongooseUserRepository implements UserRepository {
    connectionString: string;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
    }


    async connect(): Promise<void> {
        await mongoose.connect(this.connectionString);
    }

    async createUser(user: User): Promise<void> {
        const createdUser = new UserModel(user);
        await createdUser.save();
    }

    async getUserByName(username: string): Promise<User|null> {
        const user = await UserModel.findOne({
            username: username
        });

        return user;
    }
}
