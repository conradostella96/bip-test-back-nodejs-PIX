import IORedis from "ioredis";
import { captureException } from '../handlers/exceptionHandler.js';

const redis = new IORedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 0,
    lazyConnect: true,
});
export const saveCache = async (key, value, ttl) => {
    try {
        await redis.set(key, value, "EX", ttl);
    } catch (error) {
        captureException(error);
    }
}

export const getCache = async (key) => {
    try {
        return await redis.get(key);
    } catch (error) {
        captureException(error);
    }
}