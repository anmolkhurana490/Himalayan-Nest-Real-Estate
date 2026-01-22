// Auth Store - Authentication state management using Zustand
// Manages user authentication state

import { create } from 'zustand';
import { getFromStorage, setInStorage, removeFromStorage } from '@/utils/storage';

export const useAuthStore = create((set, get) => ({
    // User state
    user: null,
    authChecked: false,

    // Actions
    setUser: (user) => {
        set({ user });
        if (user) {
            setInStorage('user', user);
        } else {
            removeFromStorage('user');
        }
    },

    setAuthChecked: (checked) => set({ authChecked: checked }),

    clearUser: () => {
        set({ user: null });
        removeFromStorage('user');
    },

    // Initialize user from storage
    initializeAuth: async () => {
        const storedUser = getFromStorage('user');
        if (storedUser) {
            set({ user: storedUser });
        }
        set({ authChecked: true });
    },

    // Check if user has specific role
    hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;
        if (!Array.isArray(roles)) roles = [roles];
        return roles.includes(user.role || user.userType);
    },

    // Get current user role
    getUserRole: () => {
        const { user } = get();
        return user?.role || user?.userType || null;
    },
}));
