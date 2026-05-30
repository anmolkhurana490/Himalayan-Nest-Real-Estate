// Database Configuration and Connection Setup
// Configures PostgreSQL connection using Prisma ORM

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';

import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import pg from 'pg';

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CA_CERT set:', !!process.env.SSL_CA_CERT);
console.log('CA_CERT preview:', process.env.SSL_CA_CERT?.slice(0, 30));
console.log('SSL config:', process.env.NODE_ENV === 'production' ? 'SSL ON' : 'SSL OFF');

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