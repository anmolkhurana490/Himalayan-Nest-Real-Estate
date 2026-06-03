import redisClient from '../config/redisClient.js';

class CacheService {
    /**
     * Retrieves a cached value by key from Redis.
     * @param {string} key - The cache key to retrieve
     * @param {boolean} parseJSON - whether to return parsed JSON object
     * @return - The cached value, or null if not found or on error
     */
    async get(key) {
        try {
            const value = await redisClient.get(key);
            return value;
        } catch (error) {
            console.error(`Error getting cache for key ${key}:`, error);
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
            await redisClient.set(
                key,
                JSON.stringify(value),
                { ex: ttl }
            );
        }
        catch (error) {
            console.error(`Error setting cache for key ${key}:`, error);
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
            console.error(`Error deleting cache for key ${key}:`, error);
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
            console.error(`Error clearing cache with pattern ${pattern}:`, error);
        }
    }

    /**
     * Atomically increments a Redis counter and sets its TTL when first created (used in Rate Limiter).
     * @param {string} key - Redis cache key to increment
     * @param {number} window - Expiration time in seconds
     * @returns {Promise<number>} Current counter value, or 0 on error
     */
    async increment(key, window) {
        // Atomic INCR + EXPIRE via Lua (race condition safe)
        const SCRIPT = `
            local count = redis.call('INCR', KEYS[1])
            if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
            return count
        `;
        try {
            const count = await redisClient.eval(SCRIPT, [key], [window]);
            return count;
        }
        catch (error) {
            console.error(`Error incrementing cache for key ${key}:`, error);
            return 0;
        }
    }
}

export default new CacheService();