import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constants";

dotenv.config();

const connectDB = async () => {
    try {
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB Connected! DB Host: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;