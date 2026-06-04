import logger from '../config/logger.js';
import redisClient from '../config/redisClient.js';

class CacheService {
    /**
     * Retrieves a cached value by key from Redis.
     * @param {string} key - The cache key to retrieve
     * @return - The cached value, or null if not found or on error
     */
    async get(key) {
        try {
            const start = Date.now();

            const value = await redisClient.get(key);

            logger.info({ type: "cache", hit: !!value, duration: Date.now() - start });

            // Try parsing as JSON; fall back to raw string if it's not valid JSON
            const parsedValue = (() => {
                try { return JSON.parse(value); }
                catch { return value; }
            })();
            return parsedValue;
        } catch (error) {
            logger.warn(`Error getting cache for key ${key}: ${error}`);
            return null;
        }
    }

    /**
     * Sets a value in the cache with an optional TTL (time to live)
     * @param {string} key - The cache key to set
     * @param {*} value - The value to cache
     * @param {number} ttl - Time to live in seconds (default: 3600)
     */
    async set(key, value, ttl = 3600) {
        try {
            // Check if value is already a string to prevent double-serialization
            const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);

            await redisClient.set(
                key,
                serializedValue,
                'EX', ttl
            );
        }
        catch (error) {
            logger.warn(`Error setting cache for key ${key}: ${error}`);
        }
    }

    /**
     * Deletes a cache entry by key from Redis.
     * @param {string} key - The cache key to delete
     */
    async del(key) {
        try {
            await redisClient.del(key);
        }
        catch (error) {
            logger.warn(`Error deleting cache for key ${key}: ${error}`);
        }
    }

    /**
     * Clears cache entries matching a pattern
     * @param {string} pattern - The pattern to match cache keys (e.g., 'user:*')
     */
    async clear(pattern) {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                // Delete all matching keys in parallel
                await Promise.all(keys.map((key) => redisClient.del(key)));
            }
        }
        catch (error) {
            logger.warn(`Error clearing cache with pattern ${pattern}: ${error}`);
        }
    }
}

export default new CacheService();