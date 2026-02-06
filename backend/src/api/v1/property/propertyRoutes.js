// Property Routes Configuration
// Defines all API endpoints for property management

import express from 'express';
import propertyController from './propertyController.js';
import AuthMiddleware from '../../../middlewares/AuthMiddleware.js';
import { uploadPropertyImages, handleMulterError } from '../../../middlewares/FileUploadMiddleware.js';
import { validate, validateUUID } from '../../../middlewares/ValidationMiddleware.js';
import { createPropertyValidation, updatePropertyValidation, searchPropertyValidation } from './propertyValidation.js';
import { multipleImageUploadSchema } from '../files/fileValidation.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', validate(searchPropertyValidation, 'params'), (req, res) => propertyController.getAllProperties(req, res));

// Protected routes (authentication required) - MUST come before /:id to avoid conflicts
router.get('/my-properties',
    AuthMiddleware,
    (req, res) => propertyController.getUserProperties(req, res)
);

// Single property - comes after specific routes
router.get('/:id', validateUUID(), (req, res) => propertyController.getPropertyById(req, res));

// Protected routes for creating, updating, deleting properties
router.post('/',
    AuthMiddleware,
    uploadPropertyImages,
    handleMulterError,
    validate(multipleImageUploadSchema, 'files'),
    validate(createPropertyValidation),
    (req, res) => propertyController.createProperty(req, res)
);

router.put('/:id',
    validateUUID(),
    AuthMiddleware,
    uploadPropertyImages,
    handleMulterError,
    validate(multipleImageUploadSchema, 'files'),
    validate(updatePropertyValidation),
    (req, res) => propertyController.updateProperty(req, res)
);

router.delete('/:id',
    validateUUID(),
    AuthMiddleware,
    (req, res) => propertyController.deleteProperty(req, res)
);

export default router;
