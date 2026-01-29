// Auth Service - Business Logic Layer
// Handles authentication business logic and user management

import bcrypt from 'bcrypt';
import userRepository from '../../../repositories/userRepository.js';
import accountRepository from '../../../repositories/accountRepository.js';
import { generateToken } from '../../../utils/jwtHandlers.js';

class AuthService {
    /**
     * Register a new user with credentials or OAuth
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} - User data and token
     */
    async register(userData) {
        const { firstName, lastName, email, phone, password, provider, userType } = userData;

        // Create new user
        const user = await userRepository.create({
            name: `${firstName} ${lastName}`,
            email,
            phone,
            role: userType
        });

        if (provider === 'credentials') {
            // Hash password and create credentials account
            const hashedPassword = await bcrypt.hash(password, 10);
            await accountRepository.create({
                userId: user.id,
                provider: 'credentials',
                providerAccountId: null,
                password: hashedPassword
            });
        } else {
            // Create OAuth account
            await accountRepository.create({
                userId: user.id,
                provider,
                providerAccountId: userData.providerAccountId,
                password: null
            });
        }

        // Prepare user response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };

        return { user: userResponse };
    }

    /**
     * Login user
     * @param {Object} user - User object from database
     * @param {Object} account - Account object from database
     * @param {Object} credentials - Login credentials (password or providerAccountId)
     * @returns {Promise<Object>} - User data
     */
    async login(user, account, credentials = {}) {
        if (account.provider === 'credentials') {
            // Validate password is provided
            if (!credentials.password) {
                throw new Error('Password is required for credentials login');
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(credentials.password, account.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }
        }
        else if (credentials.providerAccountId && credentials.providerAccountId !== account.providerAccountId) {
            throw new Error('Provider account ID does not match');
        }

        // Generate JWT token
        const token = generateToken(user);

        // Prepare user response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: token
        };

        return { user: userResponse };
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
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
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
            throw new Error('User not found');
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

    /**
     * Resolve authentication with provider (only OAuth)
     * @param {Object} userData - Authentication data { email, provider, providerAccountId }
     * @returns {Promise<Object>} - User data, token, and action
     */
    async resolveAuth(userData) {
        const { email, provider, providerAccountId } = userData;

        // Find user by email
        const user = await userRepository.findByEmail(email);

        if (!user) {
            // User doesn't exist - register new user
            const result = await this.register(userData);

            // Generate JWT token
            const token = generateToken(result.user);
            result.user.token = token;

            return { user: result.user, action: 'register' };
        }

        // Check if provider account exists
        const account = await accountRepository.findByUserAndProvider(user.id, provider);

        if (account) {
            // Provider exists - login
            const result = await this.login(user, account, { providerAccountId });
            return { ...result, action: 'login' };
        }

        // Check if user already has credentials account
        const credentialsAccount = await accountRepository.findByUserAndProvider(user.id, 'credentials');
        if (credentialsAccount) {
            throw new Error('User already has credentials account. Cannot link OAuth provider.');
        }

        // Generate JWT token
        const token = generateToken(user);

        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: token
        };

        // Provider (OAuth) does not exist - link it
        await userRepository.linkAccount(user.id, provider, providerAccountId);

        return { user: userResponse, action: 'linked' };
    }
}

export default new AuthService();
