// Auth Repository - API integrations for authentication
// Handles all HTTP requests related to authentication

import api from '@/config/api.config';
import { AUTH_ENDPOINTS } from '@/config/constants/apis';

/**
 * Register new user
 */
export const registerUserAPI = async (userData) => {
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
    return response.data;
};

/**
 * Login user
 */
export const loginUserAPI = async (credentials) => {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
    return response.data;
};

/**
 * Logout user
 */
export const logoutUserAPI = async () => {
    const response = await api.post(AUTH_ENDPOINTS.LOGOUT);
    return response.data;
};

/**
 * Get current user profile
 */
export const getCurrentUserAPI = async () => {
    const response = await api.get(AUTH_ENDPOINTS.GET_PROFILE);
    return response.data;
};

/**
 * Update user profile
 */
export const updateUserProfileAPI = async (profileData) => {
    const response = await api.put(AUTH_ENDPOINTS.UPDATE_PROFILE, profileData);
    return response.data;
};

/**
 * Request password reset
 */
export const requestPasswordResetAPI = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

/**
 * Reset password
 */
export const resetPasswordAPI = async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
};
