// Auth ViewModel - Business logic for authentication
// Handles business logic for auth operations using repositories
"use client";
import { create } from 'zustand';
import { User } from '../model/userModel';
import * as authRepo from '../repositories';
import { signIn, signOut } from 'next-auth/react';
import { useAppStore } from '@/shared/stores/appStore';
import { useAuthStore } from '@/shared/stores/authStore';

export const useAuthViewModel = create((set, get) => ({
    // State
    isSubmitting: false,
    currentUser: null,

    // Actions
    setSubmitting: (isSubmitting) => set({ isSubmitting }),

    /**
     * User Registration Handler
     */
    registerUser: async (userData, oauthSignup, signupToken) => {
        try {
            set({ isSubmitting: true });
            useAppStore.getState().setLoading(true);

            // Signup token is present if this registration is part of an OAuth signup flow
            const data = oauthSignup ?
                await authRepo.completeOAuthSignupAPI(userData, signupToken)
                : await authRepo.registerUserAPI(userData);

            return {
                success: true,
                data: data,
                user: new User(data.user),
                message: data.message || 'Registration successful!'
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.message || 'Registration failed. Please try again.'
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
            set({ isSubmitting: true });
            useAppStore.getState().setLoading(true);

            const data = await signIn('credentials', {
                redirect: false,
                ...credentials
            });

            if (data.error) {
                const parsedCode = (() => {
                    try { return JSON.parse(decodeURIComponent(data.code)); }
                    catch { return {}; }
                })();
                throw new Error(parsedCode.message || 'Login failed. Please check your credentials.');
            }

            return {
                success: true,
                data: data,
                user: new User(data.user),
                message: data.message || 'Login successful!'
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.message || 'Login failed. Please check your credentials.'
            };
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * OAuth Sign-In Handler
     * @param {string} provider - The OAuth provider (e.g., 'google', 'github')
     * @param {string} redirectTo - The URL to redirect to after OAuth consent page
     */
    oauthSignIn: async (provider, redirectTo) => {
        try {
            set({ isSubmitting: true });
            useAppStore.getState().setLoading(true);

            await signIn(provider, { redirectTo });

            return {
                success: true,
                message: `${provider} OAuth Sign-In successful!`
            };
        } catch (error) {
            console.error(`${provider} OAuth Sign-In error:`, error);
            return {
                success: false,
                message: `${provider} OAuth Sign-In failed. Please try again.`
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
            set({ isSubmitting: true });
            useAppStore.getState().setLoading(true);

            await authRepo.logoutUserAPI();

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
                success: false,
                message: error.message || 'Logout Failed'
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
            return {
                success: false,
                message: error.message || 'Failed to fetch user profile'
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
            set({ isSubmitting: true });
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
            return {
                success: false,
                message: error.message || 'Failed to update profile'
            };
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    },
}));