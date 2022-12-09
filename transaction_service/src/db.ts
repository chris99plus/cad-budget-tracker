import mongoose from 'mongoose';

mongoose.set('strictQuery', true)

export async function connectDatabase() {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING!);
}
