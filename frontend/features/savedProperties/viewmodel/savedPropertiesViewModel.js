/**
 * Saved Properties ViewModel
 * State management for saved/favorite properties
 */

import { create } from 'zustand';
import * as savedPropertyRepo from "../repositories";
import { SavedPropertyModel } from '../model/SavedPropertyModel';
import { getSavedProperties } from '@/features/customer/repositories';

export const useSavedPropertiesViewModel = create((set, get) => ({
    // State
    savedProperties: [],
    isLoading: false,
    error: null,
    success: null,

    // Actions
    setSavedProperties: (savedProperties) => set({ savedProperties }),
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
     * Get all saved properties from localStorage
     */
    getSavedProperties: async () => {
        try {
            set({ isLoading: true, error: null });

            // Fetch saved properties from backend API
            const data = await savedPropertyRepo.getSavedPropertiesAPI();
            const savedProperties = data.savedProperties.map(s => new SavedPropertyModel(s));

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
     * Toggle property save/favorite status
     * @param {Object} property - Full property object to save
     */
    toggleSaveProperty: async (property) => {
        try {
            const { savedProperties } = get();
            const isSaved = savedProperties.some(p => p.id === property.id);

            if (isSaved) {
                const res = await get().removeSavedProperty(property.id);
                if (!res.success) {
                    throw new Error(res.message || 'Failed to remove saved property');
                }
            }
            else {
                const res = await get().addSavedProperty(property);
                if (!res.success) {
                    throw new Error(res.message || 'Failed to save property');
                }
            }

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
     * Add a property to saved list
     */
    addSavedProperty: async (property) => {
        try {
            set({ error: null });
            const { savedProperties } = get();

            // Call backend API to save property
            await savedPropertyRepo.createSavedPropertyAPI(property.id);

            const newSavedProperties = [...savedProperties, new SavedPropertyModel(property)];
            get().setSavedProperties(newSavedProperties);

            set({ success: 'Property saved successfully' });

            return {
                success: true,
            };
        }
        catch (error) {
            console.error('Add saved property error:', error);
            const errorMessage = 'Failed to save property';
            set({ error: errorMessage });
            return {
                success: false,
                message: errorMessage,
            };
        }
    },

    /**
     * Remove a property from saved list
     */
    removeSavedProperty: async (propertyId) => {
        try {
            set({ error: null });
            const { savedProperties } = get();

            // Call backend API to remove saved property
            await savedPropertyRepo.removeSavedPropertyAPI(propertyId);

            const newSavedProperties = savedProperties.filter(p => p.id !== propertyId);
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
    clearSavedProperties: async () => {
        try {
            await savedPropertyRepo.clearSavedPropertiesAPI();
            get().setSavedProperties([]);

            set({ success: 'All Saved Properties Cleared' });

            return {
                success: true,
            };
        } catch (error) {
            console.error('clear saved property error:', error);
            const errorMessage = 'Failed to clear properties';
            set({ error: errorMessage });

            return {
                success: false,
                message: errorMessage,
            };
        }
    },
}));
