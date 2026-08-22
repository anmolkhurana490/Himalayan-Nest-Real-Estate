"use client";
import React, { useState, useEffect } from 'react';
import { useEnquiryViewModel } from '@/features/enquiry/viewmodel/enquiryViewModel';
import { MessageCircleMore, CheckCircle, XCircle, Reply } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/utils/helpers';
import { ENQUIRY_STATUS } from '@/config/constants/user';
import { usePropertyViewModel } from '@/features/properties/viewmodel/propertyViewModel';

/**
 * ReceiverPropertyEnquiries Component
 * Displays enquiries received by property owner for a specific property
 * Used in MyPropertyDetailView (Owner's property page)
 */
const ReceiverPropertyEnquiries = ({ propertyId, onEnquiriesCountUpdate }) => {
    const { getPropertyEnquiries, respondToEnquiry, updateEnquiryStatus, propertyEnquiries } = useEnquiryViewModel();
    const [loading, setLoading] = useState(false);
    const [respondingTo, setRespondingTo] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        if (propertyId) {
            loadEnquiries();
        }
    }, [propertyId]);

    const loadEnquiries = async () => {
        try {
            setLoading(true);
            const res = await getPropertyEnquiries(propertyId, 'received', { includeSender: true });
            onEnquiriesCountUpdate(res.data.received.length);
        } catch (error) {
            console.error('Error loading enquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (enquiryId) => {
        if (!responseMessage.trim()) {
            toast.error('Please enter a response message');
            return;
        }

        const result = await respondToEnquiry(enquiryId, responseMessage);
        if (result?.success) {
            toast.success('Response sent successfully');
            setRespondingTo(null);
            setResponseMessage('');
            loadEnquiries();
        }
        else {
            toast.error(result.message);
        }
    };

    const handleStatusUpdate = async (enquiryId, status) => {
        const result = await updateEnquiryStatus(enquiryId, status);
        if (result?.success) {
            toast.success(`Enquiry marked as ${status}`);
            loadEnquiries();
        }
        else {
            toast.error(result.message);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">Property Enquiries</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage enquiries received for this property</p>
                </div>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Property Enquiries</h2>
                <p className="text-sm text-gray-600 mt-1">Manage enquiries received for this property</p>
            </div>

            <div className="p-4 sm:p-6">
                {propertyEnquiries.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageCircleMore className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No enquiries received yet for this property</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {propertyEnquiries.map((enquiry) => (
                            <div key={enquiry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                {/* Enquiry Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-900">
                                                {enquiry.sender?.name || 'Anonymous'}
                                            </h3>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${enquiry.status === ENQUIRY_STATUS.RESPONDED
                                                ? 'bg-green-100 text-green-800'
                                                : enquiry.status === ENQUIRY_STATUS.REJECTED
                                                    ? 'bg-red-100 text-red-800'
                                                    : enquiry.status === ENQUIRY_STATUS.CLOSED
                                                        ? 'bg-gray-100 text-gray-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {enquiry.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{enquiry.sender?.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{formatDate(enquiry.createdAt, 'relative')}</span>
                                </div>

                                {/* Enquiry Message */}
                                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                    <p className="text-sm text-gray-700 whitespace-pre-line">
                                        {enquiry.message.message || 'No message'}
                                    </p>
                                </div>

                                {/* Messages Thread (if exists) */}
                                {enquiry.response && (
                                    <div className="mb-3 space-y-2 pl-4 border-l-2 border-gray-200">
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-700">You:</span>
                                            <span className="text-gray-600 ml-2 whitespace-pre-line">{enquiry.response.message}</span>
                                            <span className="text-xs text-gray-400 ml-2">
                                                {formatDate(enquiry.createdAt, 'relative')}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Response Form */}
                                {respondingTo === enquiry.id && (
                                    <div className="mb-3 space-y-2">
                                        <textarea
                                            value={responseMessage}
                                            onChange={(e) => setResponseMessage(e.target.value)}
                                            placeholder="Type your response..."
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRespond(enquiry.id)}
                                                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                            >
                                                Send Response
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setRespondingTo(null);
                                                    setResponseMessage('');
                                                }}
                                                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2">
                                    {enquiry.status === ENQUIRY_STATUS.PENDING && (
                                        <>
                                            <button
                                                onClick={() => setRespondingTo(enquiry.id)}
                                                className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                                            >
                                                <Reply className="w-4 h-4 mr-1" />
                                                Respond
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(enquiry.id, ENQUIRY_STATUS.REJECTED)}
                                                className="inline-flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                                            >
                                                <XCircle className="w-4 h-4 mr-1" />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {enquiry.status === ENQUIRY_STATUS.RESPONDED && (
                                        <button
                                            onClick={() => toast.info('Chat feature coming soon!')}
                                            className="inline-flex items-center px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                                        >
                                            <MessageCircleMore className="w-4 h-4 mr-1" />
                                            Open Chat
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceiverPropertyEnquiries;
