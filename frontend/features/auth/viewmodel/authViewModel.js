// Auth ViewModel - Business logic for authentication
// Handles business logic for auth operations using repositories

import { User } from '../model/userModel';
import { setInStorage, getFromStorage, removeFromStorage } from '@/utils/storage';
import * as authRepo from '../repositories';

/**
 * User Registration Handler
 */
export const registerUser = async (userData) => {
    try {
        const data = await authRepo.registerUserAPI(userData);

        if (data.user) {
            setInStorage('user', data.user);
        }

        return {
            success: true,
            data: data,
            user: new User(data.user),
            message: data.message || 'Registration successful!'
        };
    } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
        return {
            success: false,
            error: errorMessage,
            message: 'Registration failed. Please try again.'
        };
    }
};

/**
 * User Login Handler
 */
export const loginUser = async (credentials) => {
    try {
        const data = await authRepo.loginUserAPI(credentials);

        if (data.user) {
            setInStorage('user', data.user);
        }

        return {
            success: true,
            data: data,
            user: new User(data.user),
            message: data.message || 'Login successful!'
        };
    } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Login failed';
        return {
            success: false,
            error: errorMessage,
            message: 'Login failed. Please check your credentials.'
        };
    }
};

/**
 * User Logout Handler
 */
export const logoutUser = async () => {
    try {
        await api.post(AUTH_ENDPOINTS.LOGOUT);
        await authRepo.logoutUserAPI();
        removeFromStorage('user');
        return {
            success: true,
            message: 'Logged out successfully'
        };
    } catch (error) {
        console.warn('Logout request failed', error.message);
        removeFromStorage('user');
        return {
            success: false,
            message: 'Logout failed. Please try again.'
        };
    }
};

/**
 * Get Current User Profile
 */
export const getCurrentUser = async () => {
    try {
        const data = await authRepo.getCurrentUserAPI();

        if (data.user) {
            setInStorage('user', data.user);
        }

        return {
            success: true,
            data: data,
            user: new User(data.user),
            message: data.message || 'Profile fetched successfully'
        };
    } catch (error) {
        console.error('Get current user error:', error.data);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user profile';

        if (error.response?.status === 401) {
            removeFromStorage('user');
            return {
                success: false,
                error: 'Session expired. Please login again.',
                message: 'Failed to fetch user profile'
            };
        }

        return {
            success: false,
            error: errorMessage,
            message: 'Failed to fetch user profile'
        };
    }
};

/**
 * Update User Profile
 */
export const updateUserProfile = async (profileData) => {
    try {
        const response = await api.put(AUTH_ENDPOINTS.UPDATE_PROFILE, profileData);
        const data = await authRepo.updateUserProfileAPI(profileData)
        if (data.user) {
            setInStorage('user', data.user);
        }

        return {
            success: true,
            data: data,
            user: new User(data.user),
            message: data.message || 'Profile updated successfully!'
        };
    } catch (error) {
        console.error('Update profile error:', error);
        const errorMessage = error.response?.data?.message || error.data?.message || 'Failed to update profile';

        if (error.response?.status === 401) {
            return {
                success: false,
                error: 'Session expired. Please login again.',
                message: 'Failed to update profile'
            };
        }

        return {
            success: false,
            error: errorMessage,
            message: 'Failed to update profile'
        };
    }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    const user = getFromStorage('user');
    return !!user;
};

/**
 * Get stored user data
 */
export const getStoredUser = () => {
    const userData = getFromStorage('user');
    return userData ? new User(userData) : null;
};
