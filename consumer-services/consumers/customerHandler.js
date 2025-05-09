import { client } from "../utils/RedisClient.js";
import { Customer } from "../models/Customer.js";

const STREAM_KEY = 'customers';
const startCustomerStream = async () => {
    try {

        let lastId = '0';

        while (true) {
            try {
                const response = await client.xRead(
                    {
                        key: STREAM_KEY,
                        id: lastId
                    },
                    {
                        COUNT: 1,
                        BLOCK: 5000 
                    }
                );

                if (!response) continue;

                for (const stream of response) {
                    for (const message of stream.messages) {
                        const [id, fields] = message;

                        //cast the fields to an object
                        const data = Object.fromEntries(fields); 
                        
                        // Save to MongoDB
                        const customer = new Customer(data);
                        await customer.save();
                        console.log(`Processed and saved customer with ID: ${customer._id}`);

                        // Update last processed ID
                        lastId = id;
                    }
                }
            } catch (err) {
                console.error('Error processing message:', err);
                // Continue processing even if one message fails
                continue;
            }
        }
    } catch (error) {
        console.error("Fatal error in customer stream:", error);
        process.exit(1);
    }
};

export { startCustomerStream };