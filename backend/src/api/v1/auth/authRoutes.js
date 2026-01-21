// Auth Routes Configuration
// Defines all API endpoints for authentication and user profile management

import express from 'express';
import authController from './authController.js';
import AuthMiddleware from '../../../middlewares/AuthMiddleware.js';
import { validate } from '../../../middlewares/ValidationMiddleware.js';
import { registerValidation, loginValidation, updateProfileValidation } from './authValidation.js';

const router = express.Router();

// Public authentication routes
router.post('/register', validate(registerValidation), (req, res) => authController.register(req, res));
router.post('/login', validate(loginValidation), (req, res) => authController.login(req, res));

// Protected routes (authentication required)
router.post('/logout', AuthMiddleware, (req, res) => authController.logout(req, res));
router.get('/profile', AuthMiddleware, (req, res) => authController.getCurrentUser(req, res));
router.put('/profile', AuthMiddleware, validate(updateProfileValidation), (req, res) => authController.updateUserProfile(req, res));

export default router;
