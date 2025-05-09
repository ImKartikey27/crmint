import { client } from "../utils/RedisClient.js";
import Customer from "../models/customer.models.js";

const STREAM_KEY = 'customers';

const validateCustomerData = (fields) => {
    const requiredFields = ['name', 'email', 'phone', 'address'];
    const missingFields = requiredFields.filter(field => !fields[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    return true;
};

const parseMessageData = (messageData) => {
    const data = {};
    // Convert flat array to object
    for (let i = 0; i < messageData.length; i += 2) {
        data[messageData[i]] = messageData[i + 1];
    }
    return data;
};

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
                    const messages = stream.messages;
                    
                    for (const message of messages) {
                        const id = message.id;
                        // Parse the message data into proper object format
                        const fields = parseMessageData(Object.values(message.message));

                        try {
                            // Validate customer data before saving
                            
                            validateCustomerData(fields);

                            // Save to MongoDB
                            const customer = new Customer(fields);
                            await customer.save();

                            await client.XDEL(STREAM_KEY, id);

                            console.log(`Processed and saved customer with ID: ${customer._id}`);
                        } catch (validationError) {
                            await client.XDEL(STREAM_KEY, id);
                            console.error('Customer validation failed:', {
                                messageId: id,
                                error: validationError.message,
                                data: fields
                            });
                        }

                        lastId = id;
                    }
                }
            } catch (err) {
                console.error('Error processing message:', err);
                console.error('Error details:', {
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                });
                continue;
            }
        }
    } catch (error) {
        console.error("Fatal error in customer stream:", error);
        process.exit(1);
    }
};

export { startCustomerStream };