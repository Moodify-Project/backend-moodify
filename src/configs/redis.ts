import { createClient } from 'redis';

export const redisClient = async () => {
    return await createClient({
        url: process.env.URL_REDIS
    })
      .on('error', err => console.log('Redis Client Error', err))
      .connect();
} 