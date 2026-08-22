// Property Routes Configuration
// Defines all API endpoints for property management

import express from 'express';
import propertyController from './propertyController.js';
import AuthMiddleware from '../../../middlewares/AuthMiddleware.js';
import { uploadPropertyImages, handleMulterError } from '../../../middlewares/FileUploadMiddleware.js';
import { validate, validateCUID } from '../../../middlewares/ValidationMiddleware.js';
import { createPropertyValidation, updatePropertyValidation, searchPropertyValidation } from './propertyValidation.js';
import { multipleImageUploadSchema } from '../files/fileValidation.js';
import rateLimiter from '../../../middlewares/RateLimitingMiddleware.js';
import { buildKeyByUserId } from '../../../builders/rateLimitKeyBuilder.js';

const router = express.Router();

// Public property search and retrieval routes
router.get('/', validate(searchPropertyValidation, 'query'), propertyController.getAllProperties);

// GET /my-properties (Protected) - Retrieve properties belonging to the authenticated user
router.get('/my-properties', AuthMiddleware, propertyController.getUserProperties);

router.get('/:id', validateCUID(), propertyController.getPropertyById);

// Protected property management routes
router.use(AuthMiddleware);

router.get('/:id', validateCUID(), propertyController.getPropertyById);

// POST / - Create a new property with image upload support
router.post(
    '/',
    rateLimiter(10, 10 * 60, 30 * 60, 'property', buildKeyByUserId),
    uploadPropertyImages,
    handleMulterError,
    validate(multipleImageUploadSchema, 'files'),
    validate(createPropertyValidation),
    propertyController.createProperty
);

// PUT /:id - Update an existing property by ID
router.put(
    '/:id',
    validateCUID(),
    rateLimiter(20, 10 * 60, 15 * 60, 'property', buildKeyByUserId),
    uploadPropertyImages,
    handleMulterError,
    validate(multipleImageUploadSchema, 'files'),
    validate(updatePropertyValidation),
    propertyController.updateProperty
);

// DELETE /:id - Delete a property owned by the authenticated user
router.delete(
    '/:id',
    validateCUID(),
    rateLimiter(10, 10 * 60, 30 * 60, 'property', buildKeyByUserId),
    propertyController.deleteProperty
);

export default router;
