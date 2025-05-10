import client from "./RedisClient.js";

const publishToStream = async (streamName , data) => {
    try {
        const messageData = Object.entries(data).flat();
        const messageId = await client.xAdd(streamName, '*', messageData)
        console.log(`Message published to stream ${streamName} with ID ${messageId}`);

    } catch (error) {
        
        console.log(`Error publishing message to stream ${streamName}:`, error);
        throw error
        
    }
}

export default publishToStream