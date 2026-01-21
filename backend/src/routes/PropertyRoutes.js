// Property Routes Configuration
// Defines all API endpoints for property management with appropriate middleware

import express from 'express';
import { getAllProperties, getPropertyById, getUserProperties, createProperty, updateProperty, deleteProperty } from '../controllers/PropertyController.js';
import AuthMiddleware, { validateDealer } from '../middlewares/AuthMiddleware.js';
import { uploadPropertyImages, handleMulterError } from '../middlewares/FileUploadMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllProperties);

// Protected routes (authentication required)
router.get('/my-properties', AuthMiddleware, validateDealer, getUserProperties);

router.get('/:id', getPropertyById);

// Dealer-only routes (authentication + dealer role required)
router.post('/', AuthMiddleware, validateDealer, uploadPropertyImages, handleMulterError, createProperty);
router.put('/:id', AuthMiddleware, validateDealer, uploadPropertyImages, handleMulterError, updateProperty);
router.delete('/:id', AuthMiddleware, validateDealer, deleteProperty);

export default router;