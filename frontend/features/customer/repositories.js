/**
 * Customer Repositories
 * API calls for customer-specific features (favorites, preferences)
 */

import api from '@/config/api.config';

/**
 * Toggle property as favorite/saved
 * @param {string} propertyId - Property ID to toggle
 * @returns {Promise} API response
 */
export const toggleFavorite = async (propertyId) => {
    const response = await api.post(`/users/favorites/${propertyId}`);
    return response.data;
};

/**
 * Get all saved/favorite properties
 * @returns {Promise} Array of saved properties
 */
export const getSavedProperties = async () => {
    const response = await api.get('/users/favorites');
    return response.data;
};

/**
 * Remove property from favorites
 * @param {string} propertyId - Property ID to remove
 * @returns {Promise} API response
 */
export const removeFavorite = async (propertyId) => {
    const response = await api.delete(`/users/favorites/${propertyId}`);
    return response.data;
};

/**
 * Get user preferences
 * @returns {Promise} User preferences object
 */
export const getUserPreferences = async () => {
    const response = await api.get('/users/preferences');
    return response.data;
};

/**
 * Update user preferences
 * @param {Object} preferences - Preferences object to update
 * @returns {Promise} Updated preferences
 */
export const updateUserPreferences = async (preferences) => {
    const response = await api.put('/users/preferences', preferences);
    return response.data;
};

/**
 * Get customer enquiries (sent and received)
 * @returns {Promise} Array of enquiries
 */
export const getCustomerEnquiries = async () => {
    const response = await api.get('/users/enquiries');
    return response.data;
};

/**
 * Get customer properties comparison data
 * @param {Array<string>} propertyIds - Array of property IDs to compare
 * @returns {Promise} Comparison data
 */
export const getPropertyComparison = async (propertyIds) => {
    const response = await api.post('/properties/compare', { propertyIds });
    return response.data;
};

export default {
    toggleFavorite,
    getSavedProperties,
    removeFavorite,
    getUserPreferences,
    updateUserPreferences,
    getCustomerEnquiries,
    getPropertyComparison,
};
