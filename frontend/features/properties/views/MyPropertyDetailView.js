// Property Detail View - Detailed view and editing of individual property
// Re-exported from app/dashboard/properties/[id]/page.js to follow MVVM architecture

"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { usePropertyViewModel } from '@/features/properties/viewmodel/propertyViewModel';
import EditProperty from '@/features/properties/components/EditProperty';
import ROUTES from '@/config/constants/routes';
import { MapPin, IndianRupee, Calendar, Eye, MessageCircleMore, ArrowLeft, Edit } from 'lucide-react';
import PropertyImageSlideshow from '../components/PropertyImageSlideshow';
import { toast } from 'sonner';
import { formatDate } from '@/utils/helpers';

const PropertyDetailView = () => {
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const { getPropertyById } = usePropertyViewModel();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    // Detect if we're in account or dashboard context
    const isAccountContext = pathname?.startsWith('/account');
    const propertiesListRoute = isAccountContext ? ROUTES.ACCOUNT.PROPERTIES : ROUTES.DASHBOARD.PROPERTIES;

    useEffect(() => {
        if (params?.id) {
            loadProperty(params.id);
        }
    }, [params?.id]);

    const loadProperty = async (id) => {
        try {
            setLoading(true);
            const result = await getPropertyById(id);

            if (result && result.success) {
                setProperty(result.property);
            } else {
                toast.error('Property not found');
                router.push(propertiesListRoute);
            }
        } catch (error) {
            console.error('Error loading property:', error);
            toast.error('Failed to load property');
            router.push(propertiesListRoute);
        } finally {
            setLoading(false);
        }
    };

    const handlePropertyUpdate = (updatedProperty) => {
        setProperty(updatedProperty);
        setShowEditModal(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Property not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                {/* <button
                    onClick={() => router.push(propertiesListRoute)}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Properties
                </button> */}
                <button
                    onClick={() => setShowEditModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Property
                </button>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Property Image */}
                <div className="relative">
                    <PropertyImageSlideshow images={property.images} title={property.title} />

                    <div className="absolute top-6 left-6">
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${property.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {property.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                {/* Property Info */}
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                            <div className="flex items-center text-gray-600">
                                <MapPin className="w-5 h-5 mr-2" />
                                {property.location}
                            </div>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                            {property.category}
                        </span>
                    </div>

                    <div className="flex items-center mb-6">
                        <span className="text-3xl font-bold text-green-600">{property.formattedprice}</span>
                    </div>

                    <div className="prose max-w-none mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700">{property.description}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                        <div className="text-center">
                            <div className="flex items-center justify-center text-gray-400 mb-2">
                                <Eye className="w-5 h-5" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{property.views || 0}</p>
                            <p className="text-sm text-gray-500">Views</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center text-gray-400 mb-2">
                                <MessageCircleMore className="w-5 h-5" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{property.queries || 0}</p>
                            <p className="text-sm text-gray-500">Queries</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center text-gray-400 mb-2">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                                {formatDate(property.createdAt, 'long')}
                            </p>
                            <p className="text-sm text-gray-500">Posted</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <EditProperty
                    property={property}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handlePropertyUpdate}
                />
            )}
        </div>
    );
};

export default PropertyDetailView;
