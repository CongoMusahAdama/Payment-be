import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL,  // Use environment variable
    socket: {
        tls: true, // Required for Upstash Redis (Ignore for Redis Cloud)
        rejectUnauthorized: false,
    }
});

redisClient.on('error', (err) => console.error(' Redis Connection Error:', err));

(async () => {
    try {
        await redisClient.connect();
        console.log(" Connected to Redis Successfully!");
    } catch (error) {
        console.error("Redis Connection Failed:", error);
    }
})();

export default redisClient;
