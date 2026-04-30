import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Create Redis client
export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Event listeners for Redis
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Connect to Redis (this is async but usually done at startup)
export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
};
