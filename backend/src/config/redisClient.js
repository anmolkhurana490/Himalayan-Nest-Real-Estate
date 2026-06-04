import Redis from 'ioredis';
import logger from './logger.js';

import dotenv from 'dotenv';
dotenv.config({ quiet: true });

// Connects to REDIS_URL
const redis = new Redis(process.env.REDIS_URL);

// Event listeners to monitor connection state
redis.on('connect', () => logger.info('Redis client connected!'));
redis.on('error', (err) => logger.error(`Redis Error: ${err}`));

export default redis;