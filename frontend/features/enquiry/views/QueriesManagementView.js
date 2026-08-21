// Queries Management View - Manage property inquiries (sent and received)
// Re-exported from app/dashboard/queries/page.js and app/account/enquiries/page.js

"use client";
import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, X, CheckCircle, Clock, XCircle, Mail, Calendar, Home } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { useEnquiryViewModel } from '../viewmodel/enquiryViewModel';
import { useAuthStore } from '@/shared/stores/authStore';
import { toast } from 'sonner';
import { ENQUIRY_STATUS } from '@/config/constants/user';

const QueriesManagementView = () => {
    const { user, viewMode } = useAuthStore();
    const { sentEnquiries, receivedEnquiries, getEnquiries, closeEnquiry, respondToEnquiry, updateEnquiryStatus } = useEnquiryViewModel();

    // Default to sent for buyers, received for sellers
    const [activeTab, setActiveTab] = useState(viewMode === 'buyer' ? 'sent' : 'received');

    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    // Response input state for each enquiry
    const [responseInputs, setResponseInputs] = useState({});
    const [submittingIds, setSubmittingIds] = useState(new Set());

    useEffect(() => {
        getEnquiries();
    }, []);

    const loadEnquiries = async () => {
        try {
            setLoading(true);
            setEnquiries(activeTab === 'sent' ? sentEnquiries : receivedEnquiries);
        } catch (error) {
            console.error('Error loading enquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEnquiries();
    }, [activeTab, sentEnquiries, receivedEnquiries]);

    const handleCloseEnquiry = async (enquiryId) => {
        if (!confirm('Are you sure you want to close this enquiry?')) return;

        setSubmittingIds(prev => new Set(prev).add(enquiryId));

        const result = await closeEnquiry(enquiryId);
        if (result?.success) {
            loadEnquiries(); // Refresh list
        }
        else {
            toast.error(result.message);
        }

        setSubmittingIds(prev => {
            const next = new Set(prev);
            next.delete(enquiryId);
            return next;
        });
    };

    const handleResolveEnquiry = async (enquiryId) => {
        if (!confirm('Mark this enquiry as resolved?')) return;

        setSubmittingIds(prev => new Set(prev).add(enquiryId));

        const result = await updateEnquiryStatus(enquiryId, ENQUIRY_STATUS.RESPONDED);
        if (result?.success) {
            loadEnquiries();
        }
        else {
            toast.error(result.message);
        }

        setSubmittingIds(prev => {
            const next = new Set(prev);
            next.delete(enquiryId);
            return next;
        });
    };

    const handleRejectEnquiry = async (enquiryId) => {
        if (!confirm('Are you sure you want to reject this enquiry?')) return;

        setSubmittingIds(prev => new Set(prev).add(enquiryId));

        const result = await updateEnquiryStatus(enquiryId, ENQUIRY_STATUS.REJECTED);
        if (result?.success) {
            loadEnquiries();
        }
        else {
            toast.error(result.message);
        }

        setSubmittingIds(prev => {
            const next = new Set(prev);
            next.delete(enquiryId);
            return next;
        });
    };

    const handleRespondToEnquiry = async (enquiryId) => {
        const message = responseInputs[enquiryId]?.trim();

        if (!message) {
            alert('Please enter a response message');
            return;
        }

        setSubmittingIds(prev => new Set(prev).add(enquiryId));

        const result = await respondToEnquiry(enquiryId, message);
        if (result?.success) {
            setResponseInputs(prev => ({ ...prev, [enquiryId]: '' }));
            loadEnquiries();
        }
        else {
            toast.error(result.message);
        }

        setSubmittingIds(prev => {
            const next = new Set(prev);
            next.delete(enquiryId);
            return next;
        });
    };

    const handleResponseInputChange = (enquiryId, value) => {
        setResponseInputs(prev => ({ ...prev, [enquiryId]: value }));
    };

    const filteredEnquiries = enquiries.filter(enquiry => {
        if (statusFilter === 'all') return true;
        return enquiry.status === statusFilter;
    });

    const getStatusBadge = (status) => {
        const badges = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
            responded: { color: 'bg-blue-100 text-blue-800', icon: Mail, label: 'Responded' },
            closed: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, label: 'Closed' },
            rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
        };

        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {badge.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Enquiries</h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                        {activeTab === 'sent' ? 'Enquiries you sent' : 'Enquiries you received'}
                    </p>
                </div>
                <div className="mt-2 sm:mt-0">
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                        {filteredEnquiries.length} {activeTab === 'sent' ? 'Sent' : 'Received'}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                <div className="flex space-x-2 sm:space-x-4 mb-4 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('sent')}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'sent'
                            ? 'border-green-600 text-green-700'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Sent Enquiries
                    </button>
                    <button
                        onClick={() => setActiveTab('received')}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'received'
                            ? 'border-green-600 text-green-700'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Received Enquiries
                    </button>
                </div>

                {/* Status Filters */}
                <div className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-4">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'all'
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        All ({enquiries.length})
                    </button>
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Pending ({enquiries.filter(e => e.status === 'pending').length})
                    </button>
                    <button
                        onClick={() => setStatusFilter('responded')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'responded'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Responded ({enquiries.filter(e => e.status === 'responded').length})
                    </button>
                    <button
                        onClick={() => setStatusFilter('closed')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'closed'
                            ? 'bg-gray-100 text-gray-700'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Closed ({enquiries.filter(e => e.status === 'closed').length})
                    </button>
                </div>
            </div>

            {/* Enquiries List */}
            <div className="space-y-3 sm:space-y-4">
                {filteredEnquiries.map((enquiry) => {
                    const isSubmitting = submittingIds.has(enquiry.id);
                    const isPending = enquiry.status === 'pending';
                    const isClosed = enquiry.status === 'closed' || enquiry.status === 'rejected';

                    return (
                        <div key={enquiry.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-3 sm:p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
                                            <Home className="w-5 h-5 mr-2 text-gray-400" />
                                            Property: {enquiry.property?.title}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {formatDate(enquiry.createdAt)}
                                            </span>
                                            {getStatusBadge(enquiry.status)}
                                        </div>
                                    </div>
                                </div>

                                {/* Enquiry Info */}
                                <div className="space-y-3 mb-4">
                                    {activeTab === 'sent' && (
                                        <div className="text-sm text-gray-700">
                                            <span className="font-medium">Sent to:</span> {enquiry.receiver?.name}
                                        </div>
                                    )}
                                    {activeTab === 'received' && (
                                        <div className="text-sm text-gray-700">
                                            <span className="font-medium">From:</span> {enquiry.sender?.name || enquiry.sender_id}
                                            {enquiry.sender?.email && (
                                                <span className="ml-2 text-gray-500">({enquiry.sender.email})</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Original Message */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-xs font-medium text-gray-500 mb-1">
                                            {activeTab === 'sent' ? 'Your Message' : 'Customer Message'}
                                        </div>
                                        <p className="text-sm text-gray-900 whitespace-pre-line">
                                            {enquiry.message?.message || 'No message'}
                                        </p>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {formatDate(enquiry.message?.createdAt || enquiry.createdAt, 'relative')}
                                        </div>
                                    </div>

                                    {/* Response Message (if exists) */}
                                    {enquiry.response && (
                                        <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                                            <div className="text-xs font-medium text-blue-700 mb-1">
                                                {activeTab === 'sent' ? 'Response from Owner' : 'Your Response'}
                                            </div>
                                            <p className="text-sm text-gray-900 whitespace-pre-line">
                                                {enquiry.response.message}
                                            </p>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {formatDate(enquiry.response.createdAt, 'relative')}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions for SENT enquiries */}
                                {activeTab === 'sent' && !isClosed && (
                                    <div className="flex space-x-3 mt-4">
                                        <button
                                            onClick={() => handleCloseEnquiry(enquiry.id)}
                                            disabled={isSubmitting}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isSubmitting
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'text-red-700 bg-red-100 hover:bg-red-200'
                                                }`}
                                        >
                                            <X className="w-4 h-4 inline mr-1" />
                                            {isSubmitting ? 'Closing...' : 'Close Enquiry'}
                                        </button>
                                    </div>
                                )}

                                {/* Actions for RECEIVED enquiries */}
                                {activeTab === 'received' && isPending && (
                                    <div className="space-y-3 mt-4">
                                        {/* Response textarea and send button */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Send Response
                                            </label>
                                            <textarea
                                                value={responseInputs[enquiry.id] || ''}
                                                onChange={(e) => handleResponseInputChange(enquiry.id, e.target.value)}
                                                placeholder="Type your response here..."
                                                rows="3"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                                disabled={isSubmitting}
                                            />
                                            <div className="flex space-x-3 mt-3">
                                                <button
                                                    onClick={() => handleRespondToEnquiry(enquiry.id)}
                                                    disabled={isSubmitting || !responseInputs[enquiry.id]?.trim()}
                                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isSubmitting || !responseInputs[enquiry.id]?.trim()
                                                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                                        : 'text-white bg-green-600 hover:bg-green-700'
                                                        }`}
                                                >
                                                    <Send className="w-4 h-4 inline mr-1" />
                                                    {isSubmitting ? 'Sending...' : 'Send Response'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Resolve or Reject buttons */}
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handleResolveEnquiry(enquiry.id)}
                                                disabled={isSubmitting}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isSubmitting
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'text-green-700 bg-green-100 hover:bg-green-200'
                                                    }`}
                                            >
                                                <CheckCircle className="w-4 h-4 inline mr-1" />
                                                {isSubmitting ? 'Processing...' : 'Resolve'}
                                            </button>
                                            <button
                                                onClick={() => handleRejectEnquiry(enquiry.id)}
                                                disabled={isSubmitting}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isSubmitting
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'text-red-700 bg-red-100 hover:bg-red-200'
                                                    }`}
                                            >
                                                <XCircle className="w-4 h-4 inline mr-1" />
                                                {isSubmitting ? 'Processing...' : 'Reject'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Closed status message */}
                                {isClosed && (
                                    <div className="bg-gray-50 rounded-lg p-3 mt-4">
                                        <p className="text-sm text-gray-600">
                                            This enquiry has been {enquiry.status}.
                                            {enquiry.closedAt && (
                                                <span className="ml-2">
                                                    Closed on {formatDate(enquiry.closedAt)}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredEnquiries.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No enquiries found</h3>
                    <p className="text-gray-500">
                        {statusFilter === 'all'
                            ? `You haven't ${activeTab === 'sent' ? 'sent' : 'received'} any enquiries yet.`
                            : `No ${statusFilter} enquiries at the moment.`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default QueriesManagementView;
