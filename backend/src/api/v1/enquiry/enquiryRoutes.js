// Enquiry Routes Configuration
// Defines all API endpoints for enquiry management

import express from 'express';
import enquiryController from './enquiryController.js';
import AuthMiddleware from '../../../middlewares/AuthMiddleware.js';
import { validate, validateUUID } from '../../../middlewares/ValidationMiddleware.js';
import { createEnquiryValidation, updateEnquiryValidation, updateEnquiryStatusValidation, respondEnquiryValidation } from './enquiryValidation.js';

const router = express.Router();

// Protected routes (authentication required)
router.get('/', AuthMiddleware, (req, res) => enquiryController.getEnquiries(req, res));
router.get('/:id', AuthMiddleware, validateUUID(), (req, res) => enquiryController.getEnquiryById(req, res));
router.post('/', AuthMiddleware, validate(createEnquiryValidation), (req, res) => enquiryController.createEnquiry(req, res));

// No update or delete routes for enquiries as of now - only status updates and responses
// router.put('/:id', AuthMiddleware, validateUUID(), validate(updateEnquiryValidation), (req, res) => enquiryController.updateEnquiry(req, res));
// router.delete('/:id', AuthMiddleware, validateUUID(), (req, res) => enquiryController.deleteEnquiry(req, res));

// Additional actions on an enquiry
router.post('/:id/close', AuthMiddleware, validateUUID(), (req, res) => enquiryController.closeEnquiry(req, res));
router.post('/:id/respond', AuthMiddleware, validateUUID(), validate(respondEnquiryValidation), (req, res) => enquiryController.respondToEnquiry(req, res));
router.put('/:id/status', AuthMiddleware, validateUUID(), validate(updateEnquiryStatusValidation), (req, res) => enquiryController.updateEnquiryStatus(req, res));

export default router;
