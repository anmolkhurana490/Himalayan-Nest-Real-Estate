// Database Configuration and Connection Setup
// Configures PostgreSQL connection using Prisma ORM

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import logger from "./logger.js";

import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import pg from 'pg';

// Configure PostgreSQL connection pool with SSL settings for production
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true,
    ca: process.env.SSL_CA_CERT
  } : false,
});

const adapter = new PrismaPg(pool);
const baseClient = new PrismaClient({ adapter });

// extended client with the performance logging logic
const prismaClient = baseClient.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const start = Date.now();

        // Await the database query using the new query callback
        const result = await query(args);

        const duration = Date.now() - start;

        logger.info({ type: "db", model, operation, duration });

        return result;
      }
    }
  }
});

export default prismaClient;