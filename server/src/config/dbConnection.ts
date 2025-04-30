import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

export const connectDB = async (): Promise<void> =>{
    try{
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB is connected successfully...");
    }catch(err){
        console.error("MongoDB connection error: ", err);
    }
}