// Enquiry Routes Configuration
// Defines all API endpoints for enquiry management

import express from 'express';
import enquiryController from './enquiryController.js';
import AuthMiddleware from '../../../middlewares/AuthMiddleware.js';
import { validate, validateUUID } from '../../../middlewares/ValidationMiddleware.js';
import { createEnquiryValidation, updateEnquiryValidation } from './enquiryValidation.js';

const router = express.Router();

// Public routes
router.post('/', validate(createEnquiryValidation), (req, res) => enquiryController.createEnquiry(req, res));

// Protected routes (authentication required)
router.get('/', AuthMiddleware, (req, res) => enquiryController.getEnquiries(req, res));
router.get('/:id', AuthMiddleware, validateUUID(), (req, res) => enquiryController.getEnquiryById(req, res));
router.put('/:id', AuthMiddleware, validateUUID(), validate(updateEnquiryValidation), (req, res) => enquiryController.updateEnquiry(req, res));
router.delete('/:id', AuthMiddleware, validateUUID(), (req, res) => enquiryController.deleteEnquiry(req, res));

export default router;
