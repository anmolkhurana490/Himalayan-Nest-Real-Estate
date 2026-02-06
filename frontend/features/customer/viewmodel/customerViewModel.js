/**
 * Customer ViewModel
 * State management for customer-specific features (preferences, comparisons)
 */

import { create } from 'zustand';
import * as customerRepo from '../repositories';
import { CustomerPreferences } from '../model/CustomerPreferences';
import { Property } from '@/features/properties/model/propertyModel';
import { useAppStore } from '@/shared/stores/appStore';
import { getFromStorage, setInStorage, removeFromStorage } from '@/utils/storage';

const COMPARISON_KEY = 'comparisonProperties';

export const useCustomerViewModel = create((set, get) => ({
    // State
    preferences: null,
    comparisonList: getFromStorage(COMPARISON_KEY) || [],
    customerEnquiries: [],
    isLoading: false,
    error: null,
    success: null,

    // Actions
    setPreferences: (preferences) => set({ preferences }),
    setComparisonList: (comparisonList) => {
        setInStorage(COMPARISON_KEY, comparisonList);
        set({ comparisonList });
    },
    setCustomerEnquiries: (customerEnquiries) => set({ customerEnquiries }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setSuccess: (success) => set({ success }),
    clearMessages: () => set({ error: null, success: null }),

    /**
     * Get user preferences
     */
    getPreferences: async () => {
        try {
            set({ isLoading: true, error: null });

            // For now, return default preferences until backend is ready
            // const data = await customerRepo.getUserPreferences();
            // const preferences = CustomerPreferences.fromJSON(data);

            const preferences = new CustomerPreferences();

            set({ preferences });

            return {
                success: true,
                preferences,
            };
        } catch (error) {
            console.error('Get preferences error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch preferences';
            set({ error: errorMessage });
            return {
                success: false,
                message: errorMessage,
            };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Update user preferences
     */
    updatePreferences: async (preferencesData) => {
        try {
            set({ isLoading: true, error: null });

            // For now, update local state until backend is ready
            // const data = await customerRepo.updateUserPreferences(preferencesData);
            // const preferences = CustomerPreferences.fromJSON(data);

            const preferences = new CustomerPreferences(preferencesData);

            set({
                preferences,
                success: 'Preferences updated successfully'
            });

            return {
                success: true,
                preferences,
            };
        } catch (error) {
            console.error('Update preferences error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update preferences';
            set({ error: errorMessage });
            return {
                success: false,
                message: errorMessage,
            };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Add property to comparison list
     */
    addToComparison: (property) => {
        const { comparisonList } = get();

        if (comparisonList.length >= 4) {
            return { success: false, message: 'Can compare up to 4 properties' };
        }

        if (comparisonList.some(p => p.id === property.id)) {
            return { success: false, message: 'Property already in comparison' };
        }

        const newList = [...comparisonList, property];
        get().setComparisonList(newList);

        return { success: true };
    },

    /**
     * Remove property from comparison list
     */
    removeFromComparison: (propertyId) => {
        const { comparisonList } = get();
        const newList = comparisonList.filter(p => p.id !== propertyId);
        get().setComparisonList(newList);

        return { success: true };
    },

    /**
     * Clear comparison list
     */
    clearComparison: () => {
        get().setComparisonList([]);
        removeFromStorage(COMPARISON_KEY);

        return { success: true };
    },

    /**
     * Get customer enquiries
     */
    getCustomerEnquiries: async () => {
        try {
            set({ isLoading: true, error: null });

            // For now, return empty array until backend is ready
            // const data = await customerRepo.getCustomerEnquiries();
            // const enquiries = data.enquiries || [];

            const enquiries = [];

            set({ customerEnquiries: enquiries });

            return {
                success: true,
                enquiries,
            };
        } catch (error) {
            console.error('Get enquiries error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch enquiries';
            set({ error: errorMessage });
            return {
                success: false,
                message: errorMessage,
            };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Initialize customer data on login
     */
    initializeCustomerData: async () => {
        try {
            await get().getPreferences();

            return { success: true };
        } catch (error) {
            console.error('Initialize customer data error:', error);
            return { success: false };
        }
    },

    /**
     * Clear all customer data on logout
     */
    clearCustomerData: () => {
        set({
            preferences: null,
            comparisonList: [],
            customerEnquiries: [],
            error: null,
            success: null,
        });
        removeFromStorage(COMPARISON_KEY);
    },
}));

export default useCustomerViewModel;
