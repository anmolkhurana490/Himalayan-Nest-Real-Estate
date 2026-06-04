// Database Configuration and Connection Setup
// Configures PostgreSQL connection using Prisma ORM

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';

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
const prismaClient = new PrismaClient({ adapter });

// for measuring DB query timings
prismaClient.$use(async (params, next) => {
  const start = Date.now();

  const result = await next(params);

  const duration = Date.now() - start;

  logger.info({
    type: "db",
    model: params.model,
    action: params.action,
    duration
  });

  return result;
});

export default prismaClient;