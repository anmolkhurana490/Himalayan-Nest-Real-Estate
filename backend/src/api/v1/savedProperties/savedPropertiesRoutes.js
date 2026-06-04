import { Router } from 'express';
import savedPropertyController from './savedPropertiesController.js';
import AuthMiddleware from '../../../middlewares/AuthMiddleware.js';
import { validate, validateCUID } from '../../../middlewares/ValidationMiddleware.js';
import rateLimiter from '../../../middlewares/RateLimitingMiddleware.js';
import { buildKeyByUserId } from '../../../builders/rateLimitKeyBuilder.js';

const router = Router();

// All saved property routes require authentication
router.use(AuthMiddleware);

// GET / - Retrieve all saved properties for the authenticated user
router.get('/', savedPropertyController.getSavedProperties);

// POST /:propertyId - Save a property for the authenticated user
router.post(
  '/:propertyId',
  validateCUID('propertyId'),
  rateLimiter(30, 60, 5 * 60, 'savedProp', buildKeyByUserId),
  savedPropertyController.addSavedProperty
);

// DELETE /:propertyId - Remove a saved property for the authenticated user
router.delete(
  '/:propertyId',
  validateCUID('propertyId'),
  rateLimiter(30, 60, 5 * 60, 'savedProp', buildKeyByUserId),
  savedPropertyController.removeSavedProperty
);

// DELETE / - Clear all saved properties for the authenticated user
router.delete('/', rateLimiter(30, 60, 5 * 60, 'savedProp', buildKeyByUserId), savedPropertyController.clearSavedProperties);

export default router;