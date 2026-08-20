// HimaNest Real Estate - Backend Server
// Main entry point for the Express.js application

import express from 'express';
import { setupAppMiddlewares } from './middlewares/AppMiddlewares.js';
import RequestTimingMiddleware from './middlewares/RequestTimingMiddleware.js';
import { errorHandler } from './middlewares/ErrorMiddleware.js';
import apiV1Routes from './api/v1/index.js';
import dotenv from 'dotenv';
import logger from './config/logger.js';

// Load environment variables
dotenv.config({ quiet: true });

const app = express();

// Apply App middlewares
setupAppMiddlewares(app);

// Middlewares for Testing Purposes
app.use(RequestTimingMiddleware);

// Root Route (Debugging Purpose)
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'HimaNest Real Estate Backend is running!' });
});

// API Routes
app.use('/api/v1', apiV1Routes); // API v1 routes

// Global error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
    logger.info(`🚀 Server is running at http://${HOST}:${PORT}`);
    logger.info(`📡 API v1 available at http://${HOST}:${PORT}/api/v1`);
});