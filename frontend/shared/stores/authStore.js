// Auth Store - Authentication state management using Zustand
// Manages user authentication state

import { create } from 'zustand';
import { getFromStorage, setInStorage, removeFromStorage } from '@/utils/storage';

export const useAuthStore = create((set, get) => ({
    // User state
    user: null,
    authChecked: false,
    viewMode: null, // 'buyer' | 'seller' | null (null for dealers/admins)

    // Actions
    setUser: async (user) => {
        set({ user });
        if (user) {
            setInStorage('user', user);

            // Initialize customer data if user is a customer
            if (user.role === 'customer') {
                // Dynamically import to avoid circular dependencies
                const { useCustomerViewModel } = await import('@/features/customer/viewmodel/customerViewModel');
                useCustomerViewModel.getState().initializeCustomerData();
            }
        } else {
            removeFromStorage('user');
        }
    },

    setAuthChecked: (checked) => set({ authChecked: checked }),

    clearUser: async () => {
        const { user } = get();

        // Clear customer data if user was a customer
        if (user?.role === 'customer') {
            // Dynamically import to avoid circular dependencies
            const { useCustomerViewModel } = await import('@/features/customer/viewmodel/customerViewModel');
            useCustomerViewModel.getState().clearCustomerData();
        }

        set({ user: null, viewMode: null });
        removeFromStorage('user');
        removeFromStorage('userViewMode');
    },

    // View mode management
    setViewMode: (mode) => {
        const { user } = get();
        // Dealers and admins don't have view modes
        if (user?.role === 'dealer' || user?.role === 'admin') {
            set({ viewMode: null });
            removeFromStorage('userViewMode');
            return;
        }

        set({ viewMode: mode });
        if (mode) {
            setInStorage('userViewMode', mode);
        } else {
            removeFromStorage('userViewMode');
        }
    },

    toggleViewMode: () => {
        const { viewMode } = get();
        const newMode = viewMode === 'buyer' ? 'seller' : 'buyer';
        get().setViewMode(newMode);
    },

    // Initialize user from storage
    initializeAuth: async () => {
        const storedUser = getFromStorage('user');
        const storedViewMode = getFromStorage('userViewMode');

        if (storedUser) {
            set({ user: storedUser });

            // Set view mode based on role
            if (storedUser.role === 'dealer' || storedUser.role === 'admin') {
                set({ viewMode: null }); // Dealers/admins don't use view modes
            } else {
                // Customers: restore saved mode or default to 'buyer'
                set({ viewMode: storedViewMode || 'buyer' });
            }
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