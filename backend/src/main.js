// Himalayan Nest Real Estate - Backend Server
// Main entry point for the Express.js application

import express from 'express';
import { connectToDB } from './config/db.js';
import { registerRelations } from './models/index.js';
import { setupAppMiddlewares } from './middlewares/AppMiddlewares.js';
import apiV1Routes from './api/v1/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ quiet: true });

const app = express();

// Apply App middlewares
setupAppMiddlewares(app);

// Serve static uploaded files
// Initialize database and model relationships
registerRelations(); // Set up Sequelize model associations
connectToDB(); // Connect to PostgreSQL database

// Root Route (Debugging Purpose)
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Himalayan Nest Real Estate Backend is running!' });
});

// API Routes
app.use('/api/v1', apiV1Routes); // API v1 routes

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
    console.log(`📡 API v1 available at http://${HOST}:${PORT}/api/v1`);
});