// Authentication Routes Configuration
// Defines all API endpoints for user authentication and profile management

import express from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser, updateUserProfile } from '../controllers/AuthController.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Public authentication routes
router.post('/register', registerUser);                    // User registration
router.post('/login', loginUser);                          // User login

// Protected routes (authentication required)
router.post('/logout', AuthMiddleware, logoutUser);        // User logout (clears auth cookies)
router.get('/profile', AuthMiddleware, getCurrentUser);    // Get current user profile
router.put('/profile', AuthMiddleware, updateUserProfile); // Update user profile

export default router;