import mongoose, { Schema } from "mongoose";
import { MongoServerError } from 'mongodb';
import { User, UserRepository } from "./UserRepository";

const DUPLICATE_KEY_ERROR = 11000;

const userSchema = new Schema<User>({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    licenseType: { type: String, required: true },
    passwordHash: { type: String, required: true },
    tenantName: { type: String, required: false }
});

const UserModel = mongoose.model('User', userSchema);


/**
 * Repository implementation which uses a mongo db using the mongoose framework
 */
export class MongooseUserRepository implements UserRepository {
    connectionString: string;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
    }


    async connect(): Promise<void> {
        await mongoose.connect(this.connectionString);
    }

    async createUser(user: User): Promise<User> {
        const createdUser = new UserModel(user);
        createdUser._id = new mongoose.Types.ObjectId();

        try {
            return await createdUser.save();
        } catch (err: any) {
            if (!(err instanceof MongoServerError)) {
                console.log(err);
                throw err;
            }

            if (err.code == DUPLICATE_KEY_ERROR) {
                // TODO: Specific error message depending if the username or email is duplicate
                throw "The given username or email is already taken."
            }
            else {
                console.log(err);
                throw "Failed to create user"
            }
        }
    }

    async getUserByName(username: string): Promise<User | null> {
        const user = await UserModel.findOne({
            username: username
        });

        return user;
    }
}
