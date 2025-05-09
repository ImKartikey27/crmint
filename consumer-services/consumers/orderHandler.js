import { client } from "../utils/RedisClient.js";
import { Order } from "../models/Order.js";
import { Customer } from "../models/Customer.js";

const STREAM_KEY = 'orders';

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
                        BLOCK: 5000 
                    }
                );

                if (!response) continue;

                for (const stream of response) {
                    for (const message of stream.messages) {
                        const [id, fields] = message;
                        const orderData = Object.fromEntries(fields);

                        // Validate if customer exists
                        const customerExists = await Customer.exists({ _id: orderData.customerId });
                        
                        if (!customerExists) {
                            console.warn(`Order rejected - Customer ${orderData.customer_id} not found`);
                            lastId = id; // Update lastId even for rejected orders
                            continue;
                        }

                        // Save valid order to MongoDB
                        const order = new Order(orderData);
                        await order.save();
                        console.log(`Processed and saved order with ID: ${order._id} for customer: ${orderData.customer_id}`);

                        lastId = id;
                    }
                }
            } catch (err) {
                console.error('Error processing order:', err);
                continue;
            }
        }
    } catch (error) {
        console.error("Fatal error in order stream:", error);
        process.exit(1);
    }
};

export { startOrderStream };