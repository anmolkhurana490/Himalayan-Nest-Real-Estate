import { RateLimiterRedis } from 'rate-limiter-flexible';
import redisClient from '../config/redisClient.js';
import { TooManyRequestsError } from '../utils/errorUtils.js';
import logger from '../config/logger.js';

/**
 * @param {Number} points - how much quota user has
 * @param {Number} duration - duration in seconds the quota apply
 * @param {Number} blockDuration - blocked user duration if limit exceeded
 * @param {String} keyPrefix - prefix to use in RL Cache
 * @param {Function} keyGenerator - First class function to generate RL key
 * @returns - Rate Limiting Middleware function
 */
const rateLimiter = (points, duration, blockDuration, keyPrefix, keyGenerator) => {
  const rlCache = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: `rl:${keyPrefix}`,
    points, duration, blockDuration,
  });

  return async (req, res, next) => {
    const key = keyGenerator(req);

    try {
      await rlCache.consume(key);
      next();
    }
    catch (error) {
      logger.warn(error);
      const message = `Too Many Requests! Please Try after ${blockDuration / 60} min`;
      next(new TooManyRequestsError(message));
    }
  }
}

export default rateLimiter;