// Global App Store - State management using Zustand
// Manages user authentication state and loading state

import { create } from 'zustand';
import { getFromStorage, setInStorage, removeFromStorage } from '@/utils/storage';

export const useAppStore = create((set, get) => ({
    // User state
    user: null,
    authChecked: false,

    // Loading state
    loading: false,

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

    setLoading: (loading) => set({ loading }),

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
        set({ authChecked: true, loading: false });
    },
}));
