// JWT Token Utilities for Authentication
// Provides functions to generate and verify JSON Web Tokens for user authentication

import jwt from 'jsonwebtoken';

// Generate JWT token for authenticated user
const generateToken = (user, expiresIn) => {
    return jwt.sign(
        user, // Payload data
        process.env.JWT_SECRET, // Secret key from environment
        { expiresIn } // Token expiration time
    );
}

// Verify and decode JWT token
const verifyToken = (token) => {
    try {
        // Verify token signature and expiration
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        // Token is invalid, expired, or malformed
        throw new Error(error.message);
    }
}

export { generateToken, verifyToken };