import mongoose from 'mongoose';
const databaseConnection = async ()=> {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDb Connected');   
}
export { databaseConnection }