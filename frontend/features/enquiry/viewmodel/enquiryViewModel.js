// Enquiry ViewModel - Business logic for enquiries
// Handles business logic for enquiry operations using repositories

import { create } from 'zustand';
import { Enquiry, Message } from '../model/enquiryModel';
import * as enquiryRepo from '../repositories';
import { useAppStore } from '@/shared/stores/appStore';

export const useEnquiryViewModel = create((set, get) => ({
    // State
    sentEnquiries: [],
    receivedEnquiries: [],
    propertyEnquiries: [],
    currentEnquiry: null,
    isSubmitting: false,

    // Actions
    setPropertyEnquiries: (propertyEnquiries) => set({ propertyEnquiries }),
    setCurrentEnquiry: (currentEnquiry) => set({ currentEnquiry }),
    setSubmitting: (isSubmitting) => set({ isSubmitting }),

    /**
     * Submit Property Enquiry
     */
    submitEnquiry: async (enquiryData) => {
        try {
            set({ isSubmitting: true });
            useAppStore.getState().setLoading(true);

            const data = await enquiryRepo.submitEnquiryAPI(enquiryData);
            const enquiry = new Enquiry(data.enquiry || data.data);

            const { propertyEnquiries } = get();
            set({ propertyEnquiries: [enquiry, ...propertyEnquiries] });

            return {
                success: true,
                data: data,
                enquiry,
                message: data.message || 'Enquiry submitted successfully!'
            };
        } catch (error) {
            console.error('Submit enquiry error:', error);
            return {
                success: false,
                message: error.message || 'Failed to submit enquiry'
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
        try {
            useAppStore.getState().setLoading(true);
            set({ error: null });

            const params = { includeProperty: true, includeSender: true, includeReceiver: true };

            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== '') {
                    params[key] = value;
                }
            });

            const data = await enquiryRepo.getEnquiriesAPI(params);
            const sent = (data.sent || data.data?.sent || []).map(e => new Enquiry(e));
            const received = (data.received || data.data?.received || []).map(e => new Enquiry(e));

            set({ sentEnquiries: sent, receivedEnquiries: received });

            return {
                success: true,
                data: data,
                message: data.message || 'Enquiries fetched successfully'
            };
        } catch (error) {
            console.error('Get enquiries error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch enquiries'
            };
        } finally {
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Get Property Enquiries
     */
    getPropertyEnquiries: async (propertyId, type, { includeSender = false, includeReceiver = false }) => {
        try {
            useAppStore.getState().setLoading(true);
            set({ error: null });

            const data = await enquiryRepo.getEnquiriesAPI({ propertyId, type, includeSender, includeReceiver });

            if (type === 'sent') {
                const sent = (data.sent || data.data?.sent || []).map(e => new Enquiry(e));
                set({ propertyEnquiries: sent || [] });
            }
            else {
                const received = (data.received || data.data?.received || []).map(e => new Enquiry(e));
                set({ propertyEnquiries: received || [] });
            }

            return {
                success: true,
                data: data.data,
                message: data.message || 'Property enquiries fetched successfully'
            };
        } catch (error) {
            console.error('Get property enquiries error:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch property enquiries'
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
            return {
                success: false,
                message: error.message || 'Failed to fetch enquiry'
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
            set({ isSubmitting: true });
            useAppStore.getState().setLoading(true);

            await enquiryRepo.updateEnquiryStatusAPI(enquiryId, status);

            // Update the enquiry in the appropriate state array
            const { sentEnquiries, receivedEnquiries, propertyEnquiries } = get();

            const enquiry = receivedEnquiries.find(e => e.id === enquiryId) || propertyEnquiries.find(e => e.id === enquiryId);
            if (enquiry) enquiry.status = status;

            const updatedSent = sentEnquiries?.map(e => e.id === enquiryId ? enquiry : e);
            const updatedReceived = receivedEnquiries?.map(e => e.id === enquiry.id ? enquiry : e);
            const updatedPropertyEnquiries = propertyEnquiries?.map(e => e.id === enquiry.id ? enquiry : e);

            set({
                currentEnquiry: enquiry,
                sentEnquiries: updatedSent,
                receivedEnquiries: updatedReceived,
                propertyEnquiries: updatedPropertyEnquiries,
            });

            return {
                success: true,
                enquiry,
                message: 'Enquiry status updated successfully'
            };
        } catch (error) {
            console.error('Update enquiry status error:', error);
            return {
                success: false,
                message: error.message || 'Failed to update enquiry status'
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
            set({ isSubmitting: true });
            useAppStore.getState().setLoading(true);

            const data = await enquiryRepo.deleteEnquiryAPI(enquiryId);

            // Remove the enquiry from the appropriate state array
            const { sentEnquiries, propertyEnquiries } = get();
            const updatedSent = sentEnquiries.filter(e => e.id !== enquiryId);
            const updatedReceived = propertyEnquiries.filter(e => e.id !== enquiryId);

            set({
                sentEnquiries: updatedSent,
                propertyEnquiries: updatedReceived,
            });

            return {
                success: true,
                data: data,
                message: data.message || 'Enquiry deleted successfully'
            };
        } catch (error) {
            console.error('Delete enquiry error:', error);
            return {
                success: false,
                message: error.message || 'Failed to delete enquiry'
            };
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Close Enquiry (sender only)
     */
    closeEnquiry: async (enquiryId) => {
        try {
            set({ isSubmitting: true });
            useAppStore.getState().setLoading(true);

            await enquiryRepo.closeEnquiryAPI(enquiryId);

            // Update the enquiry in sent enquiries (only sender can close)
            const { sentEnquiries, propertyEnquiries } = get();

            const enquiry = sentEnquiries.find(e => e.id === enquiryId);
            if (enquiry) {
                enquiry.status = 'closed';
                enquiry.closedAt = new Date();
            }

            const updatedSent = sentEnquiries?.map(e => e.id === enquiryId ? enquiry : e);
            const updatedPropertyEnquiries = propertyEnquiries?.map(e => e.id === enquiry.id ? enquiry : e);

            set({
                currentEnquiry: enquiry,
                sentEnquiries: updatedSent,
                propertyEnquiries: updatedPropertyEnquiries,
            });

            return {
                success: true,
                enquiry,
                message: 'Enquiry closed successfully'
            };
        } catch (error) {
            console.error('Close enquiry error:', error);
            return {
                success: false,
                message: error.message || 'Failed to close enquiry'
            };
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Respond to Enquiry (receiver only)
     */
    respondToEnquiry: async (enquiryId, message) => {
        try {
            set({ isSubmitting: true });
            useAppStore.getState().setLoading(true);

            const data = await enquiryRepo.respondToEnquiryAPI(enquiryId, message);
            const response = new Message(data.data || data.message);

            // Update the enquiry in received enquiries (only receiver can respond)
            const { propertyEnquiries, receivedEnquiries } = get();

            const enquiry = propertyEnquiries.find(e => e.id === enquiryId) || receivedEnquiries.find(e => e.id === enquiryId);
            if (enquiry) enquiry.response = response;

            const updatedPropertyEnquiries = propertyEnquiries?.map(e => e.id === enquiryId ? enquiry : e);
            const updatedReceived = receivedEnquiries?.map(e => e.id === enquiry.id ? enquiry : e);

            set({
                currentEnquiry: enquiry,
                propertyEnquiries: updatedPropertyEnquiries,
                receivedEnquiries: updatedReceived,
            });

            return {
                success: true,
                data: data,
                enquiry,
                message: data.message || 'Response sent successfully'
            };
        } catch (error) {
            console.error('Respond to enquiry error:', error);
            return {
                success: false,
                message: error.message || 'Failed to send response'
            };
        } finally {
            set({ isSubmitting: false });
            useAppStore.getState().setLoading(false);
        }
    }
}));

