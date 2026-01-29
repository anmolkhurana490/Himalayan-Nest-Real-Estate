// Property Routes Configuration
// Defines all API endpoints for property management

import express from 'express';
import propertyController from './propertyController.js';
import AuthMiddleware, { validateDealer } from '../../../middlewares/AuthMiddleware.js';
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
    // validateDealer,
    (req, res) => propertyController.getUserProperties(req, res)
);

// Single property - comes after specific routes
router.get('/:id', validateUUID(), (req, res) => propertyController.getPropertyById(req, res));

// Dealer-only routes (authentication + dealer role required)
router.post('/',
    AuthMiddleware,
    // validateDealer,
    uploadPropertyImages,
    handleMulterError,
    validate(multipleImageUploadSchema, 'files'),
    validate(createPropertyValidation),
    (req, res) => propertyController.createProperty(req, res)
);

router.put('/:id',
    validateUUID(),
    AuthMiddleware,
    // validateDealer,
    uploadPropertyImages,
    handleMulterError,
    validate(multipleImageUploadSchema, 'files'),
    validate(updatePropertyValidation),
    (req, res) => propertyController.updateProperty(req, res)
);

router.delete('/:id',
    validateUUID(),
    AuthMiddleware,
    // validateDealer,
    (req, res) => propertyController.deleteProperty(req, res)
);

export default router;
