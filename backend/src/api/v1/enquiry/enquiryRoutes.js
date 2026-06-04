// Enquiry Routes Configuration
// Defines all API endpoints for enquiry management

import express from 'express';
import enquiryController from './enquiryController.js';
import AuthMiddleware from '../../../middlewares/AuthMiddleware.js';
import { validate, validateCUID } from '../../../middlewares/ValidationMiddleware.js';
import {
  createEnquiryValidation,
  updateEnquiryValidation,
  updateEnquiryStatusValidation,
  respondEnquiryValidation
} from './enquiryValidation.js';
import rateLimiter from '../../../middlewares/RateLimitingMiddleware.js';
import { buildKeyByUserId } from '../../../builders/rateLimitKeyBuilder.js';

const router = express.Router();

// All enquiry routes require authentication
router.use(AuthMiddleware);

// GET / - List enquiries for the authenticated user
router.get('/', enquiryController.getEnquiries);

// GET /:id - Retrieve an enquiry by ID
router.get('/:id', validateCUID(), enquiryController.getEnquiryById);

// POST / - Create a new enquiry
router.post(
  '/',
  validate(createEnquiryValidation),
  rateLimiter(5, 5 * 60, 15 * 60, 'enquiry', buildKeyByUserId),
  enquiryController.createEnquiry
);

// Additional enquiry actions
router.post(
  '/:id/close',
  validateCUID(),
  rateLimiter(20, 5 * 60, 10 * 60, 'enquiry', buildKeyByUserId),
  enquiryController.closeEnquiry
);

router.post(
  '/:id/respond',
  validateCUID(),
  validate(respondEnquiryValidation),
  rateLimiter(20, 5 * 60, 10 * 60, 'enquiry', buildKeyByUserId),
  enquiryController.respondToEnquiry
);

router.put(
  '/:id/status', validateCUID(),
  validate(updateEnquiryStatusValidation),
  rateLimiter(20, 5 * 60, 10 * 60, 'enquiry', buildKeyByUserId),
  enquiryController.updateEnquiryStatus
);

// No generic update/delete endpoints for enquiries at this time
// router.put('/:id', validateUUID(), validate(updateEnquiryValidation), enquiryController.updateEnquiry);
// router.delete('/:id', validateUUID(), enquiryController.deleteEnquiry);

export default router;
