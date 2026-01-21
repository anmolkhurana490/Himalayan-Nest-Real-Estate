// Auth Service - Business Logic Layer
// Handles authentication business logic and user management

import bcrypt from 'bcrypt';
import userRepository from '../../../repositories/userRepository.js';
import { AUTH_MESSAGES } from '../../../constants/messages.js';
import { generateToken } from '../../../utils/jwtHandlers.js';

class AuthService {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} - User data and token
     */
    async register(userData) {
        const { firstName, lastName, email, phone, password, userType } = userData;

        // Check if user already exists
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error(AUTH_MESSAGES.USER_EXISTS);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await userRepository.create({
            name: `${firstName} ${lastName}`,
            email,
            phone,
            password: hashedPassword,
            role: userType
        });

        // Prepare user response
        const userResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            firstName,
            lastName
        };

        return { user: userResponse };
    }

    /**
     * Login user
     * @param {String} email - User email
     * @param {String} password - User password
     * @returns {Promise<Object>} - User data and JWT token
     */
    async login(email, password) {
        // Find user by email
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
        }

        // Generate JWT token
        const token = generateToken({ id: user.id, email: user.email, role: user.role });

        // Prepare user response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            firstName: user.name.split(' ')[0],
            lastName: user.name.split(' ')[1] || ''
        };

        return { user: userResponse, token };
    }

    /**
     * Get current user profile
     * @param {String} userId - User ID
     * @returns {Promise<Object>} - User profile data
     */
    async getCurrentUser(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }

        // Prepare user response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            firstName: user.name.split(' ')[0],
            lastName: user.name.split(' ')[1] || '',
            phone: user.phone,
            bio: user.bio,
            createdAt: user.createdAt,
        };

        return userResponse;
    }

    /**
     * Update user profile
     * @param {String} userId - User ID
     * @param {Object} updateData - Profile update data
     * @returns {Promise<Object>} - Updated user data
     */
    async updateProfile(userId, updateData) {
        const { name, phone, bio } = updateData;

        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }

        // Update user details
        const updates = { name, phone };
        if (bio !== undefined) updates.bio = bio;

        const updatedUser = await userRepository.update(userId, updates);

        // Prepare user response
        const userResponse = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            firstName: updatedUser.name.split(' ')[0],
            lastName: updatedUser.name.split(' ')[1] || '',
            phone: updatedUser.phone,
            bio: updatedUser.bio,
        };

        return userResponse;
    }
}

export default new AuthService();
