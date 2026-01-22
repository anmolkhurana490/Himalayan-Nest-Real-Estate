// Property Repository - API integrations for properties
// Handles all HTTP requests related to properties

import api from '@/config/api.config';
import { PROPERTY_ENDPOINTS } from '@/config/constants/apis';

/**
 * Get all properties with filters
 */
export const getPropertiesAPI = async (params) => {
    const response = await api.get(PROPERTY_ENDPOINTS.GET_ALL, { params });
    return response.data;
};

/**
 * Get featured properties
 */
export const getFeaturedPropertiesAPI = async (limit = 6) => {
    const response = await api.get(PROPERTY_ENDPOINTS.FEATURED, { params: { limit } });
    return response.data;
};

/**
 * Get property by ID
 */
export const getPropertyByIdAPI = async (id) => {
    const response = await api.get(PROPERTY_ENDPOINTS.GET_BY_ID(id));
    return response.data;
};

/**
 * Search properties
 */
export const searchPropertiesAPI = async (searchQuery) => {
    const response = await api.get(PROPERTY_ENDPOINTS.SEARCH, { params: { query: searchQuery } });
    return response.data;
};

/**
 * Get user's properties
 */
export const getMyPropertiesAPI = async () => {
    const response = await api.get(PROPERTY_ENDPOINTS.MY_PROPERTIES);
    return response.data;
};

/**
 * Create new property
 */
export const createPropertyAPI = async (formData) => {
    const response = await api.post(PROPERTY_ENDPOINTS.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/**
 * Update property
 */
export const updatePropertyAPI = async (propertyId, formData) => {
    const response = await api.put(PROPERTY_ENDPOINTS.UPDATE(propertyId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/**
 * Delete property
 */
export const deletePropertyAPI = async (propertyId) => {
    const response = await api.delete(PROPERTY_ENDPOINTS.DELETE(propertyId));
    return response.data;
};
