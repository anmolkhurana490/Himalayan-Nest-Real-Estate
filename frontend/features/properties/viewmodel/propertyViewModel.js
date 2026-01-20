// Property ViewModel - Business logic for properties
// Handles business logic for property operations using repositories

import { Property } from '../model/propertyModel';
import * as propertyRepo from '../repositories';

/**
 * Get All Properties with Filters
 */
export const getProperties = async (filters = {}) => {
    try {
        const params = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '') {
                params[key] = value;
            }
        });

        const data = await propertyRepo.getPropertiesAPI(params);

        return {
            success: true,
            data: data,
            properties: (data.properties || []).map(p => new Property(p)),
            message: data.message || 'Properties fetched successfully'
        };
    } catch (error) {
        console.error('Get properties error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch properties';
        return {
            success: false,
            message: errorMessage,
        };
    }
};

/**
 * Get Featured Properties
 */
export const getFeaturedProperties = async (limit = 6) => {
    try {
        const data = await propertyRepo.getFeaturedPropertiesAPI(limit);

        return {
            success: true,
            data: data,
            properties: (data.properties || data.data || []).map(p => new Property(p)),
            message: data.message || 'Featured properties fetched successfully'
        };
    } catch (error) {
        console.error('Get featured properties error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch featured properties',
        };
    }
};

/**
 * Get Property By ID
 */
export const getPropertyById = async (id) => {
    try {
        const data = await propertyRepo.getPropertyByIdAPI(id);

        return {
            success: true,
            data: data,
            property: new Property(data.property || data.data),
            message: data.message || 'Property fetched successfully'
        };
    } catch (error) {
        console.error('Get property error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch property',
        };
    }
};

/**
 * Search Properties
 */
export const searchProperties = async (searchQuery) => {
    try {
        const data = await propertyRepo.searchPropertiesAPI(searchQuery);

        return {
            success: true,
            data: data,
            properties: (data.properties || data.data || []).map(p => new Property(p)),
            message: data.message || 'Search completed successfully'
        };
    } catch (error) {
        console.error('Search properties error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to search properties',
        };
    }
};

/**
 * Get My Properties (authenticated user)
 */
export const getMyProperties = async () => {
    try {
        const data = await propertyRepo.getMyPropertiesAPI();

        return {
            success: true,
            data: data.data,
            properties: (data.data || []).map(p => new Property(p)),
            message: data.message || 'Your properties fetched successfully'
        };
    } catch (error) {
        console.error('Get my properties error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch your properties';

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
    }
};

/**
 * Create New Property
 */
export const createProperty = async (propertyData, imageFiles) => {
    try {
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

        return {
            success: true,
            data: data,
            property: new Property(data.property || data.data),
            message: data.message || 'Property created successfully'
        };
    } catch (error) {
        console.error('Create property error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create property';

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
    }
};

/**
 * Update Property
 */
export const updateProperty = async (propertyId, propertyData, selectedFiles, imagesToDelete) => {
    try {
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

        return {
            success: true,
            data: data,
            property: new Property(data.property || data.data),
            message: data.message || 'Property updated successfully'
        };
    } catch (error) {
        console.error('Update property error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update property';

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
    }
};

/**
 * Delete Property
 */
export const deleteProperty = async (propertyId) => {
    try {
        const data = await propertyRepo.deletePropertyAPI(propertyId);

        return {
            success: true,
            data: data,
            message: data.message || 'Property deleted successfully'
        };
    } catch (error) {
        console.error('Delete property error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete property';

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
    }
};
