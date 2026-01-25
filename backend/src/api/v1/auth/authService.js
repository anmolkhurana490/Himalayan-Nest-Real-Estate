// Auth Service - Business Logic Layer
// Handles authentication business logic and user management

import bcrypt from 'bcrypt';
import userRepository from '../../../repositories/userRepository.js';
import accountRepository from '../../../repositories/accountRepository.js';
import { AUTH_MESSAGES } from '../../../constants/messages.js';

class AuthService {
    /**
     * Register a new user with credentials
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} - User data and token
     */
    async register(userData) {
        const { firstName, lastName, email, phone, password, provider, userType } = userData;

        // Reject OAuth registration (handled by resolve route)
        if (provider !== 'credentials') {
            throw new Error('OAuth registration should use /resolve endpoint');
        }

        // Find existing user by email
        const existingUser = await userRepository.findByEmail(email);

        let user;

        if (existingUser) {
            // Check if credentials account already exists
            const credentialsAccount = await accountRepository.findByUserAndProvider(existingUser.id, 'credentials');

            if (credentialsAccount) {
                throw new Error('User already exists');
            }

            // Use existing user (will link credentials account)
            user = existingUser;
        } else {
            // Create new user
            user = await userRepository.create({
                name: `${firstName} ${lastName}`,
                email,
                phone,
                role: userType
            });
        }

        // Hash password and create credentials account
        const hashedPassword = await bcrypt.hash(password, 10);
        await accountRepository.create({
            userId: user.id,
            provider: 'credentials',
            providerAccountId: null,
            password: hashedPassword
        });

        // Email OTP verification can be added here
        // so that user email is verified before linking to his profile
        // otherwise, user can register with fake email which can be owned by someone else (security risk)

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
                throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
            }
        }
        else if (credentials.providerAccountId && credentials.providerAccountId !== account.providerAccountId) {
            throw new Error('Provider account ID does not match');
        }

        // Prepare user response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
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

    /**
     * Resolve authentication with provider
     * @param {Object} userData - Authentication data { email, provider, providerAccountId, password }
     * @returns {Promise<Object>} - User data, token, and action
     */
    async resolveAuth(userData) {
        const { email, provider, providerAccountId, password } = userData;

        // Find user by email
        const user = await userRepository.findByEmail(email);

        if (!user) {
            // User doesn't exist - register new user
            return this.register(userData);
        }

        // Check if provider account exists
        const account = await accountRepository.findByUserAndProvider(user.id, provider);

        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        if (account) {
            // Provider exists - login
            await this.login(user, account, { password, providerAccountId });

            return { user: userResponse, action: 'login' };
        } else {
            // Provider (OAuth) does not exist - link it
            await userRepository.linkAccount(user.id, provider, providerAccountId);

            return { user: userResponse, action: 'linked' };
        }
    }
}

export default new AuthService();
