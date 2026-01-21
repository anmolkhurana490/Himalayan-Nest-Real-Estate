// API v1 Routes - Central Router
// Aggregates all feature routes under /api/v1

import express from 'express';
import authRoutes from './auth/authRoutes.js';
import propertyRoutes from './property/propertyRoutes.js';
import enquiryRoutes from './enquiry/enquiryRoutes.js';
import subscriptionRoutes from './subscription/subscriptionRoutes.js';

const router = express.Router();

// Mount feature routes
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/subscriptions', subscriptionRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API v1 is running',
        timestamp: new Date().toISOString()
    });
});

export default router;
