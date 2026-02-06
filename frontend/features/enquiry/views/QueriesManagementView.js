// Queries Management View - Manage property inquiries and customer queries
// Re-exported from app/dashboard/queries/page.js to follow MVVM architecture

"use client";
import React, { useState, useEffect } from 'react';
import { MessageCircle, User, Mail, Phone, Calendar, Eye, CheckCircle, Clock } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

const QueriesManagementView = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedQuery, setSelectedQuery] = useState(null);

    // Mock data - Replace with actual API call
    useEffect(() => {
        loadQueries();
    }, []);

    const loadQueries = async () => {
        try {
            setLoading(true);
            // TODO: Replace with actual API call
            // const result = await getMyQueries();

            // Mock data for demonstration
            const mockQueries = [
                {
                    id: 1,
                    propertyTitle: "Luxury 3BHK Apartment in Shimla",
                    customerName: "Rajesh Kumar",
                    email: "rajesh@example.com",
                    phone: "+91 9876543210",
                    message: "I'm interested in this property. Could you provide more details about the amenities?",
                    date: "2024-01-15",
                    status: "pending"
                },
                {
                    id: 2,
                    propertyTitle: "Commercial Space in Mall Road",
                    customerName: "Priya Sharma",
                    email: "priya@example.com",
                    phone: "+91 9876543211",
                    message: "What is the rental price for this commercial space?",
                    date: "2024-01-14",
                    status: "responded"
                },
                {
                    id: 3,
                    propertyTitle: "Farmhouse in Kasauli",
                    customerName: "Amit Verma",
                    email: "amit@example.com",
                    phone: "+91 9876543212",
                    message: "Is this property available for immediate possession?",
                    date: "2024-01-13",
                    status: "pending"
                }
            ];

            setQueries(mockQueries);
        } catch (error) {
            console.error('Error loading queries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (queryId, newStatus) => {
        setQueries(prev =>
            prev.map(query =>
                query.id === queryId ? { ...query, status: newStatus } : query
            )
        );
        setSelectedQuery(null);
    };

    const filteredQueries = queries.filter(query => {
        if (filter === 'all') return true;
        return query.status === filter;
    });

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
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Queries</h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Manage inquiries from potential customers</p>
                </div>
                <div className="mt-2 sm:mt-0">
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                        {queries.length} Total Queries
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                <div className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        All ({queries.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Pending ({queries.filter(q => q.status === 'pending').length})
                    </button>
                    <button
                        onClick={() => setFilter('responded')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'responded'
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Responded ({queries.filter(q => q.status === 'responded').length})
                    </button>
                </div>
            </div>

            {/* Queries List */}
            <div className="space-y-3 sm:space-y-4">
                {filteredQueries.map((query) => (
                    <div key={query.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-3 sm:p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {query.propertyTitle}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {formatDate(query.date)}
                                        </span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${query.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-green-100 text-green-800'
                                            }`}>
                                            {query.status === 'pending' ? (
                                                <>
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Pending
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Responded
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center text-sm text-gray-700">
                                    <User className="w-4 h-4 mr-2 text-gray-400" />
                                    {query.customerName}
                                </div>
                                <div className="flex items-center text-sm text-gray-700">
                                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                    <a href={`mailto:${query.email}`} className="text-blue-600 hover:underline">
                                        {query.email}
                                    </a>
                                </div>
                                <div className="flex items-center text-sm text-gray-700">
                                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                    <a href={`tel:${query.phone}`} className="text-blue-600 hover:underline">
                                        {query.phone}
                                    </a>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-start">
                                    <MessageCircle className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                                    <p className="text-sm text-gray-700">{query.message}</p>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setSelectedQuery(query)}
                                    className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    <Eye className="w-4 h-4 inline mr-1" />
                                    View Details
                                </button>
                                {query.status === 'pending' && (
                                    <button
                                        onClick={() => handleStatusChange(query.id, 'responded')}
                                        className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4 inline mr-1" />
                                        Mark as Responded
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredQueries.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No queries found</h3>
                    <p className="text-gray-500">
                        {filter === 'all'
                            ? 'You haven\'t received any customer inquiries yet.'
                            : `No ${filter} queries at the moment.`}
                    </p>
                </div>
            )}

            {/* Query Detail Modal */}
            {selectedQuery && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Query Details</h3>
                                <button
                                    onClick={() => setSelectedQuery(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Property</label>
                                    <p className="text-gray-900 mt-1">{selectedQuery.propertyTitle}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Customer Name</label>
                                    <p className="text-gray-900 mt-1">{selectedQuery.customerName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <p className="text-gray-900 mt-1">{selectedQuery.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <p className="text-gray-900 mt-1">{selectedQuery.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Message</label>
                                    <p className="text-gray-900 mt-1">{selectedQuery.message}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Date</label>
                                    <p className="text-gray-900 mt-1">
                                        {formatDate(selectedQuery.date)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setSelectedQuery(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Close
                                </button>
                                {selectedQuery.status === 'pending' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedQuery.id, 'responded')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Mark as Responded
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QueriesManagementView;
