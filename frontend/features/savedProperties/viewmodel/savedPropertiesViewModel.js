/**
 * Saved Properties ViewModel
 * State management for saved/favorite properties
 */

import { create } from 'zustand';
import { getFromStorage, setInStorage } from '@/utils/storage';

const SAVED_PROPERTIES_KEY = 'savedProperties';

export const useSavedPropertiesViewModel = create((set, get) => ({
    // State
    savedProperties: getFromStorage(SAVED_PROPERTIES_KEY) || [],
    isLoading: false,
    error: null,
    success: null,

    // Actions
    setSavedProperties: (savedProperties) => {
        setInStorage(SAVED_PROPERTIES_KEY, savedProperties);
        set({ savedProperties });
    },
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setSuccess: (success) => set({ success }),
    clearMessages: () => set({ error: null, success: null }),

    /**
     * Check if a property is saved/favorited
     */
    isSaved: (propertyId) => {
        const { savedProperties } = get();
        return savedProperties.some(p => p.id === propertyId || p._id === propertyId);
    },

    /**
     * Toggle property save/favorite status
     * @param {Object} property - Full property object to save
     */
    toggleSaveProperty: async (property) => {
        try {
            set({ error: null });
            const { savedProperties } = get();
            const propertyId = property.id || property._id;
            const isSaved = savedProperties.some(p => (p.id === propertyId || p._id === propertyId));

            let newSavedProperties;
            if (isSaved) {
                // Remove from saved
                newSavedProperties = savedProperties.filter(p =>
                    p.id !== propertyId && p._id !== propertyId
                );
            } else {
                // Add to saved
                newSavedProperties = [...savedProperties, property];
            }

            // Update state and localStorage
            get().setSavedProperties(newSavedProperties);

            // Don't set success message in store, let component handle toast

            return {
                success: true,
                isSaved: !isSaved,
            };
        } catch (error) {
            console.error('Toggle save property error:', error);
            const errorMessage = 'Failed to save property';
            set({ error: errorMessage });

            return {
                success: false,
                message: errorMessage,
            };
        }
    },

    /**
     * Get all saved properties from localStorage
     */
    getSavedProperties: async () => {
        try {
            set({ isLoading: true, error: null });

            const savedProperties = getFromStorage(SAVED_PROPERTIES_KEY) || [];

            set({ savedProperties });

            return {
                success: true,
                properties: savedProperties,
            };
        } catch (error) {
            console.error('Get saved properties error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch saved properties';
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
     * Remove a property from saved list
     */
    removeSavedProperty: async (propertyId) => {
        try {
            set({ error: null });
            const { savedProperties } = get();

            const newSavedProperties = savedProperties.filter(p =>
                p.id !== propertyId && p._id !== propertyId
            );

            get().setSavedProperties(newSavedProperties);

            set({ success: 'Property removed from saved' });

            return {
                success: true,
            };
        } catch (error) {
            console.error('Remove saved property error:', error);
            const errorMessage = 'Failed to remove property';
            set({ error: errorMessage });

            return {
                success: false,
                message: errorMessage,
            };
        }
    },

    /**
     * Clear all saved properties
     */
    clearSavedProperties: () => {
        get().setSavedProperties([]);
        set({ success: 'All saved properties cleared' });
    },
}));
