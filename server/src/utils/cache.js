import { redisClient } from '../config/redis.js';

/**
 * Get data from cache
 * @param {string} key Redis key
 * @returns {Promise<any|null>} Parsed JSON data or null if not found/error
 */
export const getCache = async (key) => {
  try {
    if (!redisClient.isReady) return null;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Redis Get Error for key ${key}:`, error);
    return null; // Fail gracefully
  }
};

/**
 * Set data to cache
 * @param {string} key Redis key
 * @param {any} data Data to cache
 * @param {number} ttl Time to live in seconds
 */
export const setCache = async (key, data, ttl = 60) => {
  try {
    if (!redisClient.isReady) return;
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error(`Redis Set Error for key ${key}:`, error);
  }
};

/**
 * Invalidate cache by pattern
 * @param {string} pattern Redis key pattern (e.g., 'search:*')
 */
export const invalidateCache = async (pattern) => {
  try {
    if (!redisClient.isReady) return;
    
    // Scan for keys matching pattern (more efficient than KEYS)
    let cursor = 0;
    do {
      const result = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100
      });
      cursor = result.cursor;
      const keys = result.keys;
      
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } while (cursor !== 0);
  } catch (error) {
    console.error(`Redis Invalidate Error for pattern ${pattern}:`, error);
  }
};
