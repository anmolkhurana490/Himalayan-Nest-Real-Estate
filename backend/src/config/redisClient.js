import Redis from 'ioredis';

import dotenv from 'dotenv';
dotenv.config({ quiet: true });

// Connects to REDIS_URL
const redis = new Redis(process.env.REDIS_URL);

// Event listeners to monitor connection state
redis.on('connect', () => console.log('Redis client connected!'));
redis.on('error', (err) => console.error('Redis Error:', err));

export default redis;