// Database Configuration and Connection Setup
// Configures PostgreSQL connection using Sequelize ORM and initializes all models

import { Sequelize } from 'sequelize';
import UserModel from '../models/User.js';
import PropertyModel from '../models/Property.js';
import SubscriptionModel from '../models/Subscription.js';
import EnquiryModel from '../models/Enquiry.js';
import { config } from 'dotenv';

// Load environment variables
config({ quiet: true });

// Create Sequelize instance with PostgreSQL connection
export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false, // Disable SQL query logging for cleaner console
})

// Connect to database and sync models
export const connectToDB = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync all models with database (creates/updates tables)
        await sequelize.sync({ alter: true }); // Use alter to update existing tables safely
    }
    catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
}

// Initialize and export all models with sequelize instance
export const User = UserModel(sequelize);
export const Property = PropertyModel(sequelize);
export const Subscription = SubscriptionModel(sequelize);
export const Enquiry = EnquiryModel(sequelize);