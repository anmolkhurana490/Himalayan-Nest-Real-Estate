// Auth Controller - Request Handler Layer
// Handles HTTP requests and responses for authentication endpoints

import authService from './authService.js';
import { AUTH_MESSAGES, GENERAL_MESSAGES } from '../../../constants/messages.js';
import { HTTP_STATUS } from '../../../constants/httpStatus.js';

class AuthController {
    /**
     * Register a new user
     * @route POST /api/v1/auth/register
     */
    async register(req, res) {
        const { firstName, lastName, email, phone, password, userType } = req.body;

        try {
            const result = await authService.register({ firstName, lastName, email, phone, password, userType });

            return res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: AUTH_MESSAGES.REGISTER_SUCCESS,
                user: result.user
            });
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Login user
     * @route POST /api/v1/auth/login
     */
    async login(req, res) {
        const { email, password } = req.body;

        try {
            const result = await authService.login(email, password);

            // // Set cookie with JWT token
            // res.cookie('access-token', result.token, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production',
            //     sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            // });

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: AUTH_MESSAGES.LOGIN_SUCCESS,
                user: result.user,
                token: result.token
            });
        } catch (error) {
            console.error('Error logging in user:', error.message);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Logout user
     * @route POST /api/v1/auth/logout
     */
    async logout(req, res) {
        try {
            // // Clear the authentication cookie
            // res.clearCookie('access-token');

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: AUTH_MESSAGES.LOGOUT_SUCCESS
            });
        } catch (error) {
            console.error('Error logging out user:', error.message);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get current user profile
     * @route GET /api/v1/auth/profile
     */
    async getCurrentUser(req, res) {
        try {
            const user = await authService.getCurrentUser(req.user.id);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: AUTH_MESSAGES.PROFILE_FETCHED,
                user
            });
        } catch (error) {
            console.error('Error fetching current user:', error.message);
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update user profile
     * @route PUT /api/v1/auth/profile
     */
    async updateUserProfile(req, res) {
        const { name, phone, bio } = req.body;

        try {
            const user = await authService.updateProfile(req.user.id, { name, phone, bio });

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: AUTH_MESSAGES.PROFILE_UPDATED,
                user
            });
        } catch (error) {
            console.error('Error updating user profile:', error.message);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new AuthController();
