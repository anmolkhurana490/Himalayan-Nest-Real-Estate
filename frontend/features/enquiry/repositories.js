// Enquiry Repository - API integrations for enquiries
// Handles all HTTP requests related to enquiries

import api from '@/lib/api';
import { ENQUIRY_ENDPOINTS } from '@/config/constants/apis';

/**
 * Submit new enquiry
 */
export const submitEnquiryAPI = async (enquiryData) => {
    const response = await api.post(ENQUIRY_ENDPOINTS.SUBMIT, enquiryData);
    return response.data;
};

/**
 * Get all enquiries (Admin/Owner)
 */
export const getEnquiriesAPI = async (params) => {
    const response = await api.get(ENQUIRY_ENDPOINTS.GET_ALL, { params });
    return response.data;
};

/**
 * Get enquiry by ID
 */
export const getEnquiryByIdAPI = async (id) => {
    const response = await api.get(ENQUIRY_ENDPOINTS.GET_BY_ID(id));
    return response.data;
};

/**
 * Update enquiry
 */
export const updateEnquiryAPI = async (id, updates) => {
    const response = await api.put(ENQUIRY_ENDPOINTS.UPDATE(id), updates);
    return response.data;
};

/**
 * Update enquiry status to resolved/rejected (Admin/Owner)
 */
export const updateEnquiryStatusAPI = async (id, status) => {
    const response = await api.put(ENQUIRY_ENDPOINTS.UPDATE_STATUS(id), { status });
    return response.data;
};

/**
 * Delete enquiry
 */
export const deleteEnquiryAPI = async (id) => {
    const response = await api.delete(ENQUIRY_ENDPOINTS.DELETE(id));
    return response.data;
};

/**
 * Close enquiry (sender only)
 */
export const closeEnquiryAPI = async (id) => {
    const response = await api.post(ENQUIRY_ENDPOINTS.CLOSE(id));
    return response.data;
};

/**
 * Respond to enquiry (receiver only)
 */
export const respondToEnquiryAPI = async (id, message) => {
    const response = await api.post(ENQUIRY_ENDPOINTS.RESPOND(id), { message });
    return response.data;
};
