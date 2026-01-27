// Auth ViewModel - Business logic for authentication
// Handles business logic for auth operations using repositories
"use client";
import { create } from 'zustand';
import { User } from '../model/userModel';
import { setInStorage, getFromStorage, removeFromStorage } from '@/utils/storage';
import * as authRepo from '../repositories';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAppStore } from '@/shared/stores/appStore';
import { useAuthStore } from '@/shared/stores/authStore';
import ROUTES from '@/config/constants/routes';

export const useAuthViewModel = create((set, get) => ({
    // State
    isSubmitting: false,
    error: null,
    success: null,
    currentUser: null,

    // Actions
    setSubmitting: (isSubmitting) => set({ isSubmitting }),
    setError: (error) => set({ error }),
    setSuccess: (success) => set({ success }),
    clearMessages: () => set({ error: null, success: null }),

    /**
     * User Registration Handler
     */
    registerUser: async (userData) => {
        try {
            set({ isSubmitting: true, error: null, success: null });
            useAppStore.getState().setLoading(true);

            const data = await authRepo.registerUserAPI(userData);

            if (data.user) {
                useAuthStore.getState().setUser(data.user);
            }

            set({ success: data.message || 'Registration successful!' });

            return {
                success: true,
                data: data,
                user: new User(data.user),
                message: data.message || 'Registration successful!'
            };
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.data?.message || error.message || 'Registration failed';
            set({ error: errorMessage });
            return {
                success: false,
                error: errorMessage,
                message: error.data?.message || error.message || 'Registration failed. Please try again.'
            };
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * User Login Handler
     */
    loginUser: async (credentials) => {
        try {
            set({ isSubmitting: true, error: null, success: null });
            useAppStore.getState().setLoading(true);

            const data = await signIn('credentials', {
                redirect: false,
                ...credentials
            });

            if (!data.ok || !data.user) {
                throw new Error(data.error || 'Login failed');
            }

            useAuthStore.getState().setUser(data.user);
            set({ success: data.message || 'Login successful!' });

            return {
                success: true,
                data: data,
                user: new User(data.user),
                message: data.message || 'Login successful!'
            };
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            set({ error: errorMessage });
            return {
                success: false,
                error: errorMessage,
                message: 'Login failed. Please check your credentials.'
            };
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Google Sign-In Handler
     * @param {boolean} signUp - Indicates if it's a sign-up flow
     */
    googleSignIn: async (signUp = false) => {
        try {
            set({ isSubmitting: true, error: null });
            useAppStore.getState().setLoading(true);
            await signIn('google', { callbackUrl: ROUTES.DASHBOARD.ROOT });
            return {
                success: true,
                message: 'Google Sign-In successful!'
            };
        } catch (error) {
            console.error('Google Sign-In error:', error);
            const errorMessage = error.message || 'Google Sign-In failed';
            set({ error: errorMessage });
            return {
                success: false,
                error: errorMessage,
                message: 'Google Sign-In failed. Please try again.'
            };
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * User Logout Handler
     */
    logoutUser: async () => {
        try {
            set({ isSubmitting: true, error: null });
            useAppStore.getState().setLoading(true);

            await signOut();
            useAuthStore.getState().clearUser();

            return {
                success: true,
                message: 'Logged out successfully'
            };
        } catch (error) {
            console.warn('Logout request failed', error.message);
            useAuthStore.getState().clearUser();

            return {
                success: true,
                message: 'Logged out successfully'
            };
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Get Current User Profile
     */
    getCurrentUser: async () => {
        try {
            useAppStore.getState().setLoading(true);
            const data = await authRepo.getCurrentUserAPI();

            if (data.user) {
                useAuthStore.getState().setUser(data.user);
                set({ currentUser: new User(data.user) });
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
                useAuthStore.getState().clearUser();
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
        } finally {
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Update User Profile
     */
    updateUserProfile: async (profileData) => {
        try {
            set({ isSubmitting: true, error: null, success: null });
            useAppStore.getState().setLoading(true);
            const data = await authRepo.updateUserProfileAPI(profileData);

            if (data.user) {
                useAuthStore.getState().setUser(data.user);
                set({ currentUser: new User(data.user), success: 'Profile updated successfully!' });
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
            set({ error: errorMessage });

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
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: () => {
        return !!useAuthStore.getState().user;
    },

    /**
     * Get stored user data
     */
    getStoredUser: () => {
        const userData = getFromStorage('user');
        return userData ? new User(userData) : null;
    },
}));