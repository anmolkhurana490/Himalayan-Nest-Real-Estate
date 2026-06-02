import api from "@/lib/api";
import { SAVED_PROPERTIES_ENDPOINTS } from "@/config/constants/apis";

/**
 * Get all saved properties of the user
*/
export const getSavedPropertiesAPI = async () => {
  const response = await api.get(SAVED_PROPERTIES_ENDPOINTS.GET_ALL);
  return response.data;
};

/**
 * Create new saved property
*/
export const createSavedPropertyAPI = async (propertyId) => {
  const response = await api.post(SAVED_PROPERTIES_ENDPOINTS.ADD(propertyId));
  return response.data;
};

/**
 * Remove saved property
*/
export const removeSavedPropertyAPI = async (propertyId) => {
  const response = await api.delete(SAVED_PROPERTIES_ENDPOINTS.REMOVE(propertyId));
  return response.data;
};


/**
* Clear all saved properties
*/
export const clearSavedPropertiesAPI = async () => {
  const response = await api.delete(SAVED_PROPERTIES_ENDPOINTS.CLEAR);
  return response.data;
};