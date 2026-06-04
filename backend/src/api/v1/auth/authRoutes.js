// Auth Routes Configuration
// Defines all API endpoints for authentication and user profile management

import express from 'express';
import authController from './authController.js';
import AuthMiddleware from '../../../middlewares/AuthMiddleware.js';
import { validate } from '../../../middlewares/ValidationMiddleware.js';
import {
  registerValidation,
  completeOAuthSignupValidation,
  loginValidation,
  updateProfileValidation,
  emailParamValidation,
  resolveValidation
} from './authValidation.js';
import { buildKeyByIP, buildKeyByUserId } from '../../../builders/rateLimitKeyBuilder.js';
import rateLimiter from '../../../middlewares/RateLimitingMiddleware.js';

const router = express.Router();

// Public authentication routes
router.post(
  '/register',
  validate(registerValidation),
  rateLimiter(3, 60, 10 * 60, 'auth', buildKeyByIP),
  authController.register
);

router.post(
  '/complete-oauth-signup',
  validate(completeOAuthSignupValidation),
  rateLimiter(3, 60, 10 * 60, 'auth', buildKeyByIP),
  authController.completeOAuthSignup
);

router.post(
  '/login',
  validate(loginValidation),
  rateLimiter(5, 60, 5 * 60, 'auth', buildKeyByIP),
  authController.login
);

// router.get('/check-email/:email', validate(emailParamValidation, 'params'), authController.findEmail);

router.post('/oauth-resolve', validate(resolveValidation), authController.resolveAuth);

// Protected routes require a valid authenticated session
router.use(AuthMiddleware);
router.post('/logout', authController.logout);
router.get('/profile', authController.getCurrentUser);

router.patch(
  '/profile',
  validate(updateProfileValidation),
  rateLimiter(10, 5 * 60, 10 * 60, buildKeyByUserId),
  authController.updateUserProfile
);

export default router;
