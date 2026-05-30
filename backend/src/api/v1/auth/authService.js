// Auth Service - Business Logic Layer
// Handles authentication business logic and user management

import bcrypt from 'bcrypt';
import userRepository from '../../../repositories/userRepository.js';
import { generateToken, verifyToken } from '../../../utils/jwtHandlers.js';
import { OAuth2Client } from 'google-auth-library';

const SALT_ROUNDS = 10;

const selectFields = { id: true, name: true, email: true, phone: true, role: true, bio: true };

class AuthService {
    constructor() {
        this.googleClient = new OAuth2Client();
    }

    /**
     * Register a new user with credentials
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} - User data and token
     */
    async register(userData) {
        const { name, email, phone, password, userType } = userData;

        // Find existing user by email
        const existingUser = await userRepository.findByEmail(userData.email);

        if (existingUser) {
            throw new Error(`User already exists with ${existingUser.provider} account. Please login instead.`);
        }

        // Hash password and create credentials account
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create new user
        const user = await userRepository.create({
            name: name,
            email, phone, role: userType,
            password: hashedPassword
        }, selectFields);

        return { user };
    }

    /**
     * Complete user registration with OAuth
     * @param {Object} data - Registration data { name, phone, userType }
     * @param {String} signupToken - Short-lived token from resolveAuth
     * @returns {Promise<Object>} - User data and token
     */
    async completeOAuthRegistration(data, signupToken) {
        // Validate signup token and extract user info
        const decodedData = await verifyToken(signupToken);

        const userData = { ...data, ...decodedData };

        // Check if user already exists (should not happen if token is valid)
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error(`User already exists with ${existingUser.provider} account. Please login instead.`);
        }

        const newUser = await userRepository.create({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.userType,
            provider: userData.provider,
            providerAccountId: userData.providerAccountId
        }, selectFields);

        return { user: newUser };
    }

    /**
     * Login user
     * @param {String} email - User email
     * @param {String} password - User password
     * @returns {Promise<Object>} - User data
     */
    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        }, `7d`);

        // Prepare user response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        return { user: userResponse, token };
    }

    /**
     * Check if email exists
     * @param {String} email - Email to check
     * @returns {Promise<Boolean>} - True if email exists
     */
    async checkEmailExists(email) {
        const user = await userRepository.findByEmail(email);
        return !!user;
    }

    /**
     * Get current user profile
     * @param {String} userId - User ID
     * @returns {Promise<Object>} - User profile data
     */
    async getCurrentUser(userId) {
        const user = await userRepository.findById(userId, selectFields);
        if (!user) {
            throw new Error('User not found');
        }

        return { user };
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
            throw new Error('User not found');
        }

        // Update user details
        const updates = {};
        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (bio) updates.bio = bio;

        const updatedUser = await userRepository.update(userId, updates, selectFields);

        return { user: updatedUser };
    }

    /**
     * Resolve authentication with provider (only OAuth)
     * @param {Object} userData - Authentication data { provider, id_token }
     * @returns {Promise<Object>} - User data, token, and action
     */
    async resolveAuth(userData) {
        const { provider, id_token } = userData;

        // Validate provider token and extract user info (this is a placeholder, implement actual validation)
        const { email, name, providerAccountId } = await this.validateProviderToken(provider, id_token);

        // Find user by provider account ID
        const user = await userRepository.findOne({ provider, providerAccountId }, selectFields);

        if (!user) {
            const existingEmailUser = await userRepository.findByEmail(email);
            if (existingEmailUser) {
                throw new Error(`Email is already associated with another account. Please register with a different email or login with existing account.`);
            }

            // Short-lived token for signup
            const signupToken = generateToken({ email, name, provider, providerAccountId }, '15m');

            return {
                signup: true,
                signupToken,
                data: {
                    filled: { email, name },
                    required: { userType: true, phone: true },
                },
            }
        }

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        }, `7d`);

        return { user, token };
    }

    /**
     * Validate provider token and extract user info
     * @param {String} provider - Authentication provider (e.g., 'google', 'facebook')
     * @param {String} id_token - ID token from provider
     * @returns {Promise<Object>} - Extracted user info (email, name, providerAccountId)
     */
    async validateProviderToken(provider, id_token) {
        if (provider === 'google') {
            // Validate Google ID token and extract user info
            const ticket = await this.googleClient.verifyIdToken({
                idToken: id_token,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();

            return {
                providerAccountId: payload.sub,
                email: payload.email,
                name: payload.name,
                // picture: payload.picture
            };
        }
        else {
            throw new Error('Unsupported authentication provider');
        }
    }
}

export default new AuthService();
