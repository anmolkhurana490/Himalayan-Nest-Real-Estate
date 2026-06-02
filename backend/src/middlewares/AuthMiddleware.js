// Authentication Middleware for Protected Routes
// Validates JWT tokens and user permissions for secure API access

import userRepository from '../repositories/userRepository.js';
import { verifyToken } from '../utils/jwtHandlers.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errorUtils.js';

// Main authentication middleware - validates JWT token from cookies
const AuthMiddleware = async (req, res, next) => {
    // Extract access token from Authorization header (Bearer token)
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next(new UnauthorizedError('Access denied, no token provided'));
    }

    try {
        // Verify and decode the JWT token
        const decoded = verifyToken(token);

        // Fetch user from database to ensure they still exist and have correct role
        // in practical, we might want to cache user info into Redis
        const user = await userRepository.findById(decoded.id);
        if (!user || user.role !== decoded.role) {
            return next(new UnauthorizedError('Invalid Token'));
        }

        // Attach user info to request object for use in route handlers
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Token is invalid, expired, or malformed
        return next(new UnauthorizedError(error.message || 'Invalid token'));
    }
}

// Role-based access control - ensures user has dealer permissions
export const validateDealer = (req, res, next) => {
    if (req.user && req.user.role === 'dealer') {
        return next(); // User is a dealer, allow access
    }
    return next(new ForbiddenError('Access denied. Dealer Role required.'));
}

export default AuthMiddleware;