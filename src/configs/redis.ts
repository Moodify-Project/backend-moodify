import { createClient } from 'redis';

export const redisClient = async () => {
    return await createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        password: process.env.REDIS_PASSWORD
    })
      .on('error', err => console.log('Redis Client Error', err))
      .connect();
} 