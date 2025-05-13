import { client } from "../utils/RedisClient.js";
import Order from "../models/order.models.js";
import Customer from "../models/customer.models.js";

const STREAM_KEY = 'orders';

const validateOrderData = (fields) => {
    const requiredFields = ['customerId', 'product', 'quantity', 'price', 'status'];
    const missingFields = requiredFields.filter(field => !fields[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    return true;
};

const parseMessageData = (messageData) => {
    const data = {};
    for (let i = 0; i < messageData.length; i += 2) {
        data[messageData[i]] = messageData[i + 1];
    }
    return data;
};

const startOrderStream = async () => {
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
                        BLOCK: 1000 
                    }
                );

                if (!response) continue;

                for (const stream of response) {
                    const messages = stream.messages;
                    
                    for (const message of messages) {
                        const id = message.id;
                        const fields = parseMessageData(Object.values(message.message));

                        try {
                            // First validate order data
                            validateOrderData(fields);

                            // Then check if customer exists
                            const customerExists = await Customer.exists({ _id: fields.customerId });
                            
                            if (!customerExists) {
                                console.warn('Order validation failed:', {
                                    messageId: id,
                                    error: `Customer ${fields.customer_id} not found`,
                                    data: fields
                                });
                                lastId = id;
                                await client.XDEL(STREAM_KEY, id);
                                continue;
                            }

                            // Save valid order to MongoDB
                            const order = new Order({
                                ...fields,
                                status: 'pending',
                                createdAt: new Date()
                            });
                            
                            await order.save();
                            
                            await client.XDEL(STREAM_KEY, id);
                            
                            console.log(`Processed and saved order:`, {
                                orderId: order._id,
                                customerId: fields.customer_id,
                                total: fields.total
                            });

                        } catch (validationError) {
                            await client.XDEL(STREAM_KEY, id);
                            console.error('Order validation failed:', {
                                messageId: id,
                                error: validationError.message,
                                data: fields
                            });
                        }

                        lastId = id;
                    }
                }
            } catch (err) {
                console.error('Error processing order stream:', err);
                continue;
            }
        }
    } catch (error) {
        console.error("Fatal error in order stream:", error);
        process.exit(1);
    }
};

export { startOrderStream };