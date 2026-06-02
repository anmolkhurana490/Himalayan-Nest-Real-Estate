import { Router } from 'express';
import savedPropertyController from './savedPropertiesController.js';
import AuthMiddleware from '../../../middlewares/AuthMiddleware.js';
import { validate, validateCUID } from '../../../middlewares/ValidationMiddleware.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(AuthMiddleware);

// Get all saved properties for the user
router.get('/', savedPropertyController.getSavedProperties);

// Save a property for the user
router.post('/:propertyId', validateCUID('propertyId'), savedPropertyController.addSavedProperty);

// Unsave a property for the user
router.delete('/:propertyId', validateCUID('propertyId'), savedPropertyController.removeSavedProperty);

// Clear all saved properties for the user
router.delete('/', savedPropertyController.clearSavedProperties);

export default router;