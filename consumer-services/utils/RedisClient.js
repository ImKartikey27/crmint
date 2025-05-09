import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-17928.c245.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 17928
    }
});

client.on('error', err => console.log('Redis Client Error', err));


const connectRedis = async () => {
    try {
        await client.connect();
        console.log("Redis Connected!");
        
    } catch (error) {
        log.error("Error connecting to Redis:", error);
        process.exit(1);
    }
}

export {
    client,
    connectRedis
};
