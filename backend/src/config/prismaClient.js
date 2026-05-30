// Database Configuration and Connection Setup
// Configures PostgreSQL connection using Prisma ORM

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';

import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import pg from 'pg';

console.log('CA_CERT set:', !!process.env.SSL_CA_CERT);
console.log('CA_CERT preview:', process.env.SSL_CA_CERT?.slice(0, 30));
console.log('CA_CERT preview:', process.env.SSL_CA_CERT?.slice(-30));
console.log('CA_CERT has real newlines:', process.env.SSL_CA_CERT?.includes('\n'));
console.log('CA_CERT has literal \\n:', process.env.SSL_CA_CERT?.includes('\\n'));

// Configure PostgreSQL connection pool with SSL settings for production
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true,
    ca: process.env.SSL_CA_CERT
  } : false,
});

const adapter = new PrismaPg(pool);
const prismaClient = new PrismaClient({ adapter });

console.log("Prisma PostgreSQL connected successfully");

export default prismaClient;