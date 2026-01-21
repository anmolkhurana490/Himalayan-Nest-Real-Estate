// Authentication Middleware for Protected Routes
// Validates JWT tokens and user permissions for secure API access

import { User } from '../config/db.js';
import { verifyToken } from '../utils/jwtHandlers.js';

// Main authentication middleware - validates JWT token from cookies
const AuthMiddleware = async (req, res, next) => {
    // Extract access token from HTTP-only cookie
    const token = req.cookies['access-token'];
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        // Verify and decode the JWT token
        const decoded = verifyToken(token);

        // Fetch user from database to ensure they still exist and have correct role
        const user = await User.findByPk(decoded.id);
        if (!user || user.role !== decoded.role) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach user info to request object for use in route handlers
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Token is invalid, expired, or malformed
        return res.status(401).json({ message: error.message || 'Invalid token' });
    }
}

// Role-based access control - ensures user has dealer permissions
export const validateDealer = (req, res, next) => {
    if (req.user && req.user.role === 'dealer') {
        return next(); // User is a dealer, allow access
    }
    return res.status(403).json({ error: 'Access denied. Dealer Role required.' });
}

export default AuthMiddleware;