// Properties Management View - List and manage all dealer properties
// Re-exported from app/dashboard/properties/page.js to follow MVVM architecture

"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePropertyViewModel } from '@/features/properties/viewmodel/propertyViewModel';
import { fetchImageUrl } from '@/utils/imageHelpers';
import { useRouter } from 'next/navigation';
import ROUTES from '@/config/constants/routes';
import { Building, Eye, MessageCircleMore, Plus, Search } from 'lucide-react';

const PropertiesManagementView = () => {
    const { getMyProperties, updateProperty, deleteProperty, myProperties } = usePropertyViewModel();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProperties, setFilteredProperties] = useState([]);
    const router = useRouter();

    useEffect(() => {
        loadProperties();
    }, []);

    useEffect(() => {
        let filtered = properties;

        // Apply filter
        if (filter === 'active') {
            filtered = properties.filter(p => p.isActive);
        } else if (filter === 'inactive') {
            filtered = properties.filter(p => !p.isActive);
        }

        // Apply search term
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = properties.filter(p =>
                p.title.toLowerCase().includes(lowerSearchTerm) ||
                p.description.toLowerCase().includes(lowerSearchTerm) ||
                p.location.toLowerCase().includes(lowerSearchTerm)
            );
        }

        setFilteredProperties(filtered);
    }, [properties, filter, searchTerm]);

    const loadProperties = async () => {
        try {
            setLoading(true);
            const result = await getMyProperties();

            if (result && result.success) {
                setProperties(result.properties || []);
            }
        } catch (error) {
            console.error('Error loading properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (propertyId, currentStatus) => {
        const result = await updateProperty(propertyId, { isActive: !currentStatus });
        if (result && result.success) {
            alert(`Property ${currentStatus ? 'Deactivated' : 'Activated'} successfully`);
            setFilteredProperties(prev =>
                prev.map(property =>
                    property.id === propertyId ? { ...property, isActive: !currentStatus } : property
                )
            );
        } else {
            alert(result.error || 'Failed to update property status');
        }
    };

    const handleDelete = async (propertyId) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            const result = await deleteProperty(propertyId);
            if (result && result.success) {
                setFilteredProperties(prev => prev.filter(property => property.id !== propertyId));
                alert(result.message || 'Property deleted successfully');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div> */}
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
                <button
                    onClick={() => router.push(ROUTES.DASHBOARD.CREATE_PROPERTY)}
                    className="mt-4 sm:mt-0 inline-flex items-center px-2 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Property
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-2 sm:px-4 py-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    {/* Status Filter */}
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                ? 'bg-green-100 text-green-700'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            All ({properties.length})
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Active ({properties.filter(p => p.isActive).length})
                        </button>
                        <button
                            onClick={() => setFilter('inactive')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'inactive'
                                ? 'bg-green-100 text-green-700'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Inactive ({properties.filter(p => !p.isActive).length})
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-1/2 lg:w-1/3">
                        <input
                            type="text"
                            placeholder="Search properties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {filteredProperties.map((property) => (
                    <div key={property.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Property Image */}
                        <div className="relative h-48">
                            <Image
                                src={fetchImageUrl(property.image) || '/logos/default-property.jpg'}
                                alt={property.title}
                                onError={e => e.target.src = '/logos/default-property.jpg'}
                                fill sizes="(max-width: 400px) 100vw, (max-width: 768px) 50vw, (max-width: 768px) 33vw, 25vw"
                                className="object-cover"
                            />
                            <div className="absolute top-2 right-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${property.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {property.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                    {property.title}
                                </h3>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
                                    {property.category}
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {property.description}
                            </p>

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-500 text-sm">{property.location}</span>
                                <span className="text-lg font-bold text-green-600">{property.formattedprice}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleStatusToggle(property.id, property.isActive)}
                                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${property.isActive
                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                >
                                    {property.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => router.push(ROUTES.DASHBOARD.PROPERTY_DETAIL(property.id))}
                                    className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    View & Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(property.id)}
                                    className="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span className="flex items-center">
                                        <Eye className="w-4 h-4 mr-1" />
                                        {property.views || 0} views
                                    </span>
                                    <span className="flex items-center">
                                        <MessageCircleMore className="w-4 h-4 mr-1" />
                                        {property.queries || 0} queries
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {new Date(property.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredProperties.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm ? 'Try adjusting your search criteria.' : 'Start by adding your first property.'}
                    </p>

                    <button
                        onClick={() => router.push(ROUTES.DASHBOARD.CREATE_PROPERTY)}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Your First Property
                    </button>
                </div>
            )}
        </div>
    );
};

export default PropertiesManagementView;
