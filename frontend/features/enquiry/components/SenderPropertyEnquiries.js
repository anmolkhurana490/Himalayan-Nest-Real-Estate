"use client";
import React, { useState, useEffect } from 'react';
import { useEnquiryViewModel } from '@/features/enquiry/viewmodel/enquiryViewModel';
import { useAuthStore } from '@/shared/stores/authStore'
import { MessageCircleMore, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { ENQUIRY_STATUS } from '@/config/constants/user';
import { toast } from 'sonner';

/**
 * SenderPropertyEnquiries Component
 * Displays enquiries sent by current user for a specific property
 * Used in PropertyDetailView (Public property page)
 */
const SenderPropertyEnquiries = ({ propertyId }) => {
    const { getPropertyEnquiries, propertyEnquiries } = useEnquiryViewModel();
    const [loading, setLoading] = useState(false);

    const { user } = useAuthStore();

    useEffect(() => {
        if (propertyId) {
            loadEnquiries();
        }
    }, [propertyId]);

    if (!user) return null; // no enquiries if not authenticated

    const loadEnquiries = async () => {
        try {
            setLoading(true);
            await getPropertyEnquiries(propertyId, 'sent', {});
        } catch (error) {
            console.error('Error loading enquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm px-2 py-4 sm:px-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Enquiries</h3>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                </div>
            </div>
        );
    }

    if (propertyEnquiries.length === 0) {
        return null; // Don't show anything if no enquiries exist
    }

    return (
        <div className="bg-white rounded-lg shadow-sm px-2 py-4 sm:px-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Enquiries for this Property</h3>

            <div className="space-y-3">
                {propertyEnquiries.map((enquiry) => (
                    <div key={enquiry.id} className="border border-gray-200 rounded-lg p-3">
                        {/* Status and Date */}
                        <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${enquiry.status === ENQUIRY_STATUS.RESOLVED
                                ? 'bg-green-100 text-green-800'
                                : enquiry.status === ENQUIRY_STATUS.REJECTED
                                    ? 'bg-red-100 text-red-800'
                                    : enquiry.status === ENQUIRY_STATUS.CLOSED
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {enquiry.status === ENQUIRY_STATUS.RESOLVED && <CheckCircle className="w-3 h-3" />}
                                {enquiry.status === ENQUIRY_STATUS.REJECTED && <XCircle className="w-3 h-3" />}
                                {enquiry.status === ENQUIRY_STATUS.CLOSED && <XCircle className="w-3 h-3" />}
                                {enquiry.status === ENQUIRY_STATUS.PENDING && <Clock className="w-3 h-3" />}
                                {enquiry.status}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(enquiry.createdAt, 'short')}</span>
                        </div>

                        {/* Enquiry Message */}
                        <div className="bg-gray-50 rounded-lg p-2 mb-2">
                            <p className="text-sm text-gray-700 whitespace-pre-line">
                                You: {enquiry.message?.message || 'No message'}
                            </p>
                        </div>

                        {/* Response Message (if exists) */}
                        {enquiry.response && (
                            <div className="space-y-2 pl-3 border-l-2 border-green-200 mb-2">
                                <p className="text-xs text-gray-600 font-medium mb-1">Response:</p>
                                <p className="text-sm text-gray-700 whitespace-pre-line">{enquiry.response.message}</p>
                                <span className="text-xs text-gray-400">
                                    {formatDate(enquiry.response.createdAt, 'short')}
                                </span>
                            </div>
                        )}

                        {/* Chat Button */}
                        {enquiry.isOpenForChat() && (
                            <button
                                onClick={() => toast.info('Chat feature coming soon!')}
                                className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors"
                            >
                                Open Chat
                            </button>
                        )}

                        {/* Status Info */}
                        {enquiry.status === ENQUIRY_STATUS.PENDING && (
                            <p className="text-xs text-gray-500 mt-2">Waiting for property owner's response</p>
                        )}
                        {enquiry.status === ENQUIRY_STATUS.REJECTED && (
                            <p className="text-xs text-red-600 mt-2">This enquiry was not accepted</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SenderPropertyEnquiries;
