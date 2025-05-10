// 1. Start consumer
// 2. Connect to Redis
// 3. Connect to MongoDB
// 4. Start order and customer streams
import {connectRedis} from "./utils/RedisClient.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { startOrderStream } from "./consumers/orderHandler.js";
import { startCustomerStream } from "./consumers/customerHandler.js";
dotenv.config();


const start = async () => {
    try {
        await connectDB();
        await connectRedis();

        
        startCustomerStream();
        startOrderStream();
        console.log("Consumer services started successfully");
        

    } catch (error) {
        console.error("Error starting consumer:", error);
        process.exit(1);
    }
}

start();
