import Redis from 'ioredis';

import dotenv from 'dotenv';
import logger from './logger';
dotenv.config({ quiet: true });

// Connects to REDIS_URL
const redis = new Redis(process.env.REDIS_URL);

// Event listeners to monitor connection state
redis.on('connect', () => logger.info('Redis client connected!'));
redis.on('error', (err) => logger.error('Redis Error:', err));

export default redis;