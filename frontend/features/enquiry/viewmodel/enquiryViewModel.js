// Enquiry ViewModel - Business logic for enquiries
// Handles business logic for enquiry operations using repositories

import { create } from 'zustand';
import { Enquiry } from '../model/enquiryModel';
import * as enquiryRepo from '../repositories';
import { useAppStore } from '@/shared/stores/appStore';

export const useEnquiryViewModel = create((set, get) => ({
    // State
    enquiries: [],
    propertyEnquiries: [],
    currentEnquiry: null,
    isSubmitting: false,
    error: null,
    success: null,

    // Actions
    setEnquiries: (enquiries) => set({ enquiries }),
    setPropertyEnquiries: (propertyEnquiries) => set({ propertyEnquiries }),
    setCurrentEnquiry: (currentEnquiry) => set({ currentEnquiry }),
    setSubmitting: (isSubmitting) => set({ isSubmitting }),
    setError: (error) => set({ error }),
    setSuccess: (success) => set({ success }),
    clearMessages: () => set({ error: null, success: null }),

    /**
     * Submit Property Enquiry
     */
    submitEnquiry: async (enquiryData) => {
        try {
            set({ isSubmitting: true, error: null, success: null });
            useAppStore.getState().setLoading(true);

            const data = await enquiryRepo.submitEnquiryAPI(enquiryData);
            const enquiry = new Enquiry(data.enquiry || data.data);

            set({ success: 'Enquiry submitted successfully!' });

            return {
                success: true,
                data: data,
                enquiry,
                message: data.message || 'Enquiry submitted successfully!'
            };
        } catch (error) {
            console.error('Submit enquiry error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit enquiry';
            set({ error: errorMessage });
            return {
                success: false,
                error: errorMessage,
                message: 'Failed to submit enquiry'
            };
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Get All Enquiries (Admin/Owner)
     */
    getEnquiries: async (filters = {}) => {
        const { enquiries } = get();

        // Return cached data if exists
        if (enquiries.length > 0) {
            return {
                success: true,
                enquiries,
                fromCache: true
            };
        }

        try {
            useAppStore.getState().setLoading(true);
            set({ error: null });

            const params = {};

            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== '') {
                    params[key] = value;
                }
            });

            const data = await enquiryRepo.getEnquiriesAPI(params);
            const enquiries = (data.enquiries || data.data || []).map(e => new Enquiry(e));

            set({ enquiries });

            return {
                success: true,
                data: data,
                enquiries,
                message: data.message || 'Enquiries fetched successfully'
            };
        } catch (error) {
            console.error('Get enquiries error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch enquiries';
            set({ error: errorMessage });

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
        } finally {
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Get Property Enquiries
     */
    getPropertyEnquiries: async (propertyId) => {
        try {
            useAppStore.getState().setLoading(true);
            set({ error: null });

            const data = await enquiryRepo.getPropertyEnquiriesAPI(propertyId);
            const propertyEnquiries = (data.enquiries || data.data || []).map(e => new Enquiry(e));

            set({ propertyEnquiries });

            return {
                success: true,
                data: data,
                enquiries: propertyEnquiries,
                message: data.message || 'Property enquiries fetched successfully'
            };
        } catch (error) {
            console.error('Get property enquiries error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch property enquiries';
            set({ error: errorMessage });

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
        } finally {
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Get Enquiry By ID
     */
    getEnquiryById: async (enquiryId) => {
        try {
            useAppStore.getState().setLoading(true);
            set({ error: null, currentEnquiry: null });

            const data = await enquiryRepo.getEnquiryByIdAPI(enquiryId);
            const enquiry = new Enquiry(data.enquiry || data.data);

            set({ currentEnquiry: enquiry });

            return {
                success: true,
                data: data,
                enquiry,
                message: data.message || 'Enquiry fetched successfully'
            };
        } catch (error) {
            console.error('Get enquiry error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch enquiry';
            set({ error: errorMessage });

            if (error.response?.status === 401) {
                return {
                    success: false,
                    error: 'Authentication required. Please login.',
                    message: 'Failed to fetch enquiry'
                };
            }

            return {
                success: false,
                error: errorMessage,
                message: 'Failed to fetch enquiry'
            };
        } finally {
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Update Enquiry Status
     */
    updateEnquiryStatus: async (enquiryId, status) => {
        try {
            set({ isSubmitting: true, error: null, success: null });
            useAppStore.getState().setLoading(true);

            const data = await enquiryRepo.updateEnquiryStatusAPI(enquiryId, { status });
            const enquiry = new Enquiry(data.enquiry || data.data);

            set({ currentEnquiry: enquiry, success: 'Enquiry status updated successfully!' });

            return {
                success: true,
                data: data,
                enquiry,
                message: data.message || 'Enquiry status updated successfully'
            };
        } catch (error) {
            console.error('Update enquiry status error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update enquiry status';
            set({ error: errorMessage });

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
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Delete Enquiry
     */
    deleteEnquiry: async (enquiryId) => {
        try {
            set({ isSubmitting: true, error: null, success: null });
            useAppStore.getState().setLoading(true);

            const data = await enquiryRepo.deleteEnquiryAPI(enquiryId);

            set({ success: 'Enquiry deleted successfully!' });

            return {
                success: true,
                data: data,
                message: data.message || 'Enquiry deleted successfully'
            };
        } catch (error) {
            console.error('Delete enquiry error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete enquiry';
            set({ error: errorMessage });

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
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    }
}));

