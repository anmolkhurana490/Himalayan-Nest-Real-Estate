// Property ViewModel - Business logic for properties
// Handles business logic for property operations using repositories

import { create } from 'zustand';
import { Property } from '../model/propertyModel';
import * as propertyRepo from '../repositories';
import { useAppStore } from '@/shared/stores/appStore';

export const usePropertyViewModel = create((set, get) => ({
    // State
    properties: [],
    featuredProperties: [],
    currentProperty: null,
    myProperties: [],
    isSubmitting: false,
    error: null,
    success: null,

    // Actions
    setProperties: (properties) => set({ properties }),
    setFeaturedProperties: (featuredProperties) => set({ featuredProperties }),
    setCurrentProperty: (currentProperty) => set({ currentProperty }),
    setMyProperties: (myProperties) => set({ myProperties }),
    setSubmitting: (isSubmitting) => set({ isSubmitting }),
    setError: (error) => set({ error }),
    setSuccess: (success) => set({ success }),
    clearMessages: () => set({ error: null, success: null }),

    /**
     * Get All Properties with Filters
     */
    getProperties: async (filters = {}) => {
        try {
            useAppStore.getState().setLoading(true);
            set({ error: null });

            const params = {};
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== '') {
                    params[key] = value;
                }
            });

            const data = await propertyRepo.getPropertiesAPI(params);
            const properties = (data.properties || []).map(p => new Property(p));

            set({ properties });

            return {
                success: true,
                data: data,
                properties,
                message: data.message || 'Properties fetched successfully'
            };
        } catch (error) {
            console.error('Get properties error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch properties';
            set({ error: errorMessage });
            return {
                success: false,
                message: errorMessage,
            };
        } finally {
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Get Featured Properties
     */
    getFeaturedProperties: async (limit = 6) => {
        try {
            useAppStore.getState().setLoading(true);
            set({ error: null });

            const data = await propertyRepo.getFeaturedPropertiesAPI(limit);
            const featuredProperties = (data.properties || data.data || []).map(p => new Property(p));

            set({ featuredProperties });

            return {
                success: true,
                data: data,
                properties: featuredProperties,
                message: data.message || 'Featured properties fetched successfully'
            };
        } catch (error) {
            console.error('Get featured properties error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch featured properties';
            set({ error: errorMessage });
            return {
                success: false,
                message: errorMessage,
            };
        } finally {
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Get Property By ID
     */
    getPropertyById: async (id) => {
        try {
            useAppStore.getState().setLoading(true);
            set({ error: null, currentProperty: null });

            const data = await propertyRepo.getPropertyByIdAPI(id);
            const property = new Property(data.property || data.data);

            set({ currentProperty: property });

            return {
                success: true,
                data: data,
                property,
                message: data.message || 'Property fetched successfully'
            };
        } catch (error) {
            console.error('Get property error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch property';
            set({ error: errorMessage });
            return {
                success: false,
                message: errorMessage,
            };
        } finally {
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Search Properties
     */
    searchProperties: async (searchQuery) => {
        try {
            useAppStore.getState().setLoading(true);
            set({ error: null });

            const data = await propertyRepo.searchPropertiesAPI(searchQuery);
            const properties = (data.properties || data.data || []).map(p => new Property(p));

            set({ properties });

            return {
                success: true,
                data: data,
                properties,
                message: data.message || 'Search completed successfully'
            };
        } catch (error) {
            console.error('Search properties error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to search properties';
            set({ error: errorMessage });
            return {
                success: false,
                message: errorMessage,
            };
        } finally {
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Get My Properties (authenticated user)
     */
    getMyProperties: async () => {
        try {
            useAppStore.getState().setLoading(true);
            set({ error: null });

            const data = await propertyRepo.getMyPropertiesAPI();
            const myProperties = (data.data || []).map(p => new Property(p));

            set({ myProperties });

            return {
                success: true,
                data: data.data,
                properties: myProperties,
                message: data.message || 'Your properties fetched successfully'
            };
        } catch (error) {
            console.error('Get my properties error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch your properties';
            set({ error: errorMessage });

            if (error.response?.status === 401) {
                return {
                    success: false,
                    error: 'Authentication required. Please login.',
                    message: 'Failed to fetch your properties'
                };
            }

            return {
                success: false,
                error: errorMessage,
                message: 'Failed to fetch your properties'
            };
        } finally {
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Create New Property
     */
    createProperty: async (propertyData, imageFiles) => {
        try {
            set({ isSubmitting: true, error: null, success: null });
            useAppStore.getState().setLoading(true);

            const formData = new FormData();

            formData.append('title', propertyData.title);
            formData.append('description', propertyData.description || '');
            formData.append('category', propertyData.category);
            formData.append('purpose', propertyData.purpose);
            formData.append('location', propertyData.location);
            formData.append('price', propertyData.price);

            if (imageFiles && imageFiles.length > 0) {
                for (let i = 0; i < imageFiles.length; i++) {
                    formData.append('images', imageFiles[i]);
                }
            }

            const data = await propertyRepo.createPropertyAPI(formData);
            const property = new Property(data.property || data.data);

            set({ success: 'Property created successfully!' });

            return {
                success: true,
                data: data,
                property,
                message: data.message || 'Property created successfully'
            };
        } catch (error) {
            console.error('Create property error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create property';
            set({ error: errorMessage });

            if (error.response?.status === 401) {
                return {
                    success: false,
                    error: 'Authentication required. Please login.',
                    message: 'Failed to create property'
                };
            }

            return {
                success: false,
                error: errorMessage,
                message: 'Failed to create property'
            };
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Update Property
     */
    updateProperty: async (propertyId, propertyData, selectedFiles, imagesToDelete) => {
        try {
            set({ isSubmitting: true, error: null, success: null });
            useAppStore.getState().setLoading(true);

            const formData = new FormData();

            Object.entries(propertyData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });

            if (selectedFiles && selectedFiles.length > 0) {
                for (let i = 0; i < selectedFiles.length; i++) {
                    formData.append('images', selectedFiles[i]);
                }
            }

            if (imagesToDelete && imagesToDelete.length > 0) {
                formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
            }

            const data = await propertyRepo.updatePropertyAPI(propertyId, formData);
            const property = new Property(data.property || data.data);

            set({ currentProperty: property, success: 'Property updated successfully!' });

            return {
                success: true,
                data: data,
                property,
                message: data.message || 'Property updated successfully'
            };
        } catch (error) {
            console.error('Update property error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update property';
            set({ error: errorMessage });

            if (error.response?.status === 401) {
                return {
                    success: false,
                    error: 'Authentication required. Please login.',
                    message: 'Failed to update property'
                };
            }

            return {
                success: false,
                error: errorMessage,
                message: 'Failed to update property'
            };
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Delete Property
     */
    deleteProperty: async (propertyId) => {
        try {
            set({ isSubmitting: true, error: null, success: null });
            useAppStore.getState().setLoading(true);

            const data = await propertyRepo.deletePropertyAPI(propertyId);

            set({ success: 'Property deleted successfully!' });

            return {
                success: true,
                data: data,
                message: data.message || 'Property deleted successfully'
            };
        } catch (error) {
            console.error('Delete property error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete property';
            set({ error: errorMessage });

            if (error.response?.status === 401) {
                return {
                    success: false,
                    error: 'Authentication required. Please login.',
                    message: 'Failed to delete property'
                };
            }

            return {
                success: false,
                error: errorMessage,
                message: 'Failed to delete property'
            };
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    }
}));
