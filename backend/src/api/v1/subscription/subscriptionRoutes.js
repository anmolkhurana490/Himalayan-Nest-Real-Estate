// Subscription Routes Configuration
// Defines all API endpoints for subscription management

import express from 'express';
import subscriptionController from './subscriptionController.js';
import AuthMiddleware, { validateDealer } from '../../../middlewares/AuthMiddleware.js';
import { validate } from '../../../middlewares/ValidationMiddleware.js';
import { createSubscriptionValidation, updateSubscriptionValidation } from './subscriptionValidation.js';

const router = express.Router();

// Protected routes (authentication + dealer role required)
router.post('/', AuthMiddleware, validateDealer, validate(createSubscriptionValidation), (req, res) =>
    subscriptionController.subscribe(req, res)
);

router.get('/my-subscription', AuthMiddleware, validateDealer, (req, res) =>
    subscriptionController.getSubscription(req, res)
);

router.get('/status', AuthMiddleware, validateDealer, (req, res) =>
    subscriptionController.checkSubscriptionStatus(req, res)
);

router.put('/', AuthMiddleware, validateDealer, validate(updateSubscriptionValidation), (req, res) =>
    subscriptionController.updateSubscription(req, res)
);

router.delete('/', AuthMiddleware, validateDealer, (req, res) =>
    subscriptionController.cancelSubscription(req, res)
);

// Admin routes
router.get('/', AuthMiddleware, (req, res) =>
    subscriptionController.getAllSubscriptions(req, res)
);

export default router;
