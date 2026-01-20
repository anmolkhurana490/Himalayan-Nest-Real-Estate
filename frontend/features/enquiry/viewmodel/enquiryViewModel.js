// Enquiry ViewModel - Business logic for enquiries
// Handles business logic for enquiry operations using repositories

import { Enquiry } from '../model/enquiryModel';
import * as enquiryRepo from '../repositories';

/**
 * Submit Property Enquiry
 */
export const submitEnquiry = async (enquiryData) => {
    try {
        const data = await enquiryRepo.submitEnquiryAPI(enquiryData);

        return {
            success: true,
            data: data,
            enquiry: new Enquiry(data.enquiry || data.data),
            message: data.message || 'Enquiry submitted successfully!'
        };
    } catch (error) {
        console.error('Submit enquiry error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to submit enquiry';
        return {
            success: false,
            error: errorMessage,
            message: 'Failed to submit enquiry'
        };
    }
};

/**
 * Get All Enquiries (Admin/Owner)
 */
export const getEnquiries = async (filters = {}) => {
    try {
        const params = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '') {
                params[key] = value;
            }
        });

        const data = await enquiryRepo.getEnquiriesAPI(params);

        return {
            success: true,
            data: data,
            enquiries: (data.enquiries || data.data || []).map(e => new Enquiry(e)),
            message: data.message || 'Enquiries fetched successfully'
        };
    } catch (error) {
        console.error('Get enquiries error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch enquiries';

        if (error.response?.status === 401) {
            return {
                success: false,
                error: 'Authentication required. Please login.',
                message: 'Failed to fetch enquiries'
            };
        }

        return {
            success: false,
            error: errorMessage,
            message: 'Failed to fetch enquiries'
        };
    }
};

/**
 * Get Property Enquiries
 */
export const getPropertyEnquiries = async (propertyId) => {
    try {
        const response = await api.get(ENQUIRY_ENDPOINTS.GET_PROPERTY_ENQUIRIES(propertyId));
        const data = response.data;

        return {
            success: true,
            data: data,
            enquiries: (data.enquiries || data.data || []).map(e => new Enquiry(e)),
            message: data.message || 'Property enquiries fetched successfully'
        };
    } catch (error) {
        console.error('Get property enquiries error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch property enquiries';

        if (error.response?.status === 401) {
            return {
                success: false,
                error: 'Authentication required. Please login.',
                message: 'Failed to fetch property enquiries'
            };
        }

        return {
            success: false,
            error: errorMessage,
            message: 'Failed to fetch property enquiries'
        };
    }
};

/**
 * Update Enquiry Status
 */
export const updateEnquiryStatus = async (enquiryId, status) => {
    try {
        const response = await api.put(ENQUIRY_ENDPOINTS.UPDATE_STATUS(enquiryId), { status });
        const data = response.data;

        return {
            success: true,
            data: data,
            enquiry: new Enquiry(data.enquiry || data.data),
            message: data.message || 'Enquiry status updated successfully'
        };
    } catch (error) {
        console.error('Update enquiry status error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update enquiry status';

        if (error.response?.status === 401) {
            return {
                success: false,
                error: 'Authentication required. Please login.',
                message: 'Failed to update enquiry status'
            };
        }

        return {
            success: false,
            error: errorMessage,
            message: 'Failed to update enquiry status'
        };
    }
};

/**
 * Delete Enquiry
 */
export const deleteEnquiry = async (enquiryId) => {
    try {
        const response = await api.delete(ENQUIRY_ENDPOINTS.DELETE(enquiryId));
        const data = response.data;

        return {
            success: true,
            data: data,
            message: data.message || 'Enquiry deleted successfully'
        };
    } catch (error) {
        console.error('Delete enquiry error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete enquiry';

        if (error.response?.status === 401) {
            return {
                success: false,
                error: 'Authentication required. Please login.',
                message: 'Failed to delete enquiry'
            };
        }

        return {
            success: false,
            error: errorMessage,
            message: 'Failed to delete enquiry'
        };
    }
};

/**
 * Submit Contact Form (alias for submitEnquiry)
 */
export const submitContactForm = submitEnquiry;

