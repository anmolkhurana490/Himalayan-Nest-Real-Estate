// App Store - Global application state management using Zustand
// Manages global loading state and other app-wide states

import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
    // Global loading state
    loading: false,

    // Actions
    setLoading: (loading) => set({ loading }),

    // Start loading
    startLoading: () => set({ loading: true }),

    // Stop loading
    stopLoading: () => set({ loading: false }),
}));

