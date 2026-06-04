// Subscription Routes Configuration
// Defines all API endpoints for subscription management

import express from 'express';
import subscriptionController from './subscriptionController.js';
import AuthMiddleware, { validateDealer } from '../../../middlewares/AuthMiddleware.js';
import { validate } from '../../../middlewares/ValidationMiddleware.js';
import { createSubscriptionValidation, updateSubscriptionValidation } from './subscriptionValidation.js';
import rateLimiter from '../../../middlewares/RateLimitingMiddleware.js';
import { buildKeyByUserId } from '../../../builders/rateLimitKeyBuilder.js';

const router = express.Router(AuthMiddleware);

// Dealer-only subscription routes
router.get('/my-subscription', validateDealer, subscriptionController.getSubscription);
router.get('/status', validateDealer, subscriptionController.checkSubscriptionStatus);

router.post(
  '/',
  rateLimiter(10, 60, 10 * 60, 'subsribe', buildKeyByUserId),
  validateDealer, validate(createSubscriptionValidation),
  subscriptionController.subscribe
);

router.put(
  '/',
  rateLimiter(10, 60, 10 * 60, 'subsribe', buildKeyByUserId),
  validateDealer,
  validate(updateSubscriptionValidation),
  subscriptionController.updateSubscription
);

router.delete(
  '/',
  rateLimiter(10, 5 * 60, 10 * 60, 'subsribe', buildKeyByUserId),
  validateDealer,
  subscriptionController.cancelSubscription
);

// Admin routes can be added here if needed
// router.get('/', subscriptionController.getAllSubscriptions);

export default router;
