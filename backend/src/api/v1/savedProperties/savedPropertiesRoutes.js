import { Router } from 'express';
import savedPropertyController from './savedPropertiesController.js';
import AuthMiddleware from '../../../middlewares/AuthMiddleware.js';
import { validate, validateCUID } from '../../../middlewares/ValidationMiddleware.js';

const router = Router();

// All saved property routes require authentication
router.use(AuthMiddleware);

// GET / - Retrieve all saved properties for the authenticated user
router.get('/', savedPropertyController.getSavedProperties);

// POST /:propertyId - Save a property for the authenticated user
router.post('/:propertyId', validateCUID('propertyId'), savedPropertyController.addSavedProperty);

// DELETE /:propertyId - Remove a saved property for the authenticated user
router.delete('/:propertyId', validateCUID('propertyId'), savedPropertyController.removeSavedProperty);

// DELETE / - Clear all saved properties for the authenticated user
router.delete('/', savedPropertyController.clearSavedProperties);

export default router;