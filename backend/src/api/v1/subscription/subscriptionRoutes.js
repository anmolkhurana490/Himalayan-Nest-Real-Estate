// Subscription Routes Configuration
// Defines all API endpoints for subscription management

import express from 'express';
import subscriptionController from './subscriptionController.js';
import AuthMiddleware, { validateDealer } from '../../../middlewares/AuthMiddleware.js';
import { validate } from '../../../middlewares/ValidationMiddleware.js';
import { createSubscriptionValidation, updateSubscriptionValidation } from './subscriptionValidation.js';

const router = express.Router();

// Dealer-only subscription routes
router.post('/', validateDealer, validate(createSubscriptionValidation), subscriptionController.subscribe);
router.get('/my-subscription', validateDealer, subscriptionController.getSubscription);
router.get('/status', validateDealer, subscriptionController.checkSubscriptionStatus);
router.put('/', validateDealer, validate(updateSubscriptionValidation), subscriptionController.updateSubscription);
router.delete('/', validateDealer, subscriptionController.cancelSubscription);

// Admin routes can be added here if needed
// router.get('/', subscriptionController.getAllSubscriptions);

export default router;
