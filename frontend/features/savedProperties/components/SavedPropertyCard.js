/**
 * Saved Property Card Component
 * Card component for displaying saved/favorite properties
 */

'use client';

import { MapPin, Bed, Bath, Home, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSavedPropertiesViewModel } from '@/features/savedProperties/viewmodel/savedPropertiesViewModel';
import { useCustomerViewModel } from '@/features/customer/viewmodel/customerViewModel';
import ROUTES from '@/config/constants/routes';
import { toast } from 'sonner';

export default function SavedPropertyCard({ property }) {
    const router = useRouter();
    const { toggleSaveProperty } = useSavedPropertiesViewModel();
    const { addToComparison } = useCustomerViewModel();

    const propertyId = property.id || property._id;

    const handleRemove = async (e) => {
        e.stopPropagation();
        const result = await toggleSaveProperty(property);
        if (result?.success) {
            toast.success('Property removed from saved');
        }
    };

    const handleAddToComparison = (e) => {
        e.stopPropagation();
        const result = addToComparison(property);
        if (result?.success) {
            toast.success('Property added to comparison');
        } else if (result?.message) {
            toast.error(result.message);
        }
    };

    const handleClick = () => {
        router.push(ROUTES.PROPERTIES.DETAIL(propertyId));
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
        >
            {/* Image */}
            <div className="relative h-48">
                <img
                    src={property.image || '/logos/default-property.jpg'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                />
                <button
                    onClick={handleRemove}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    title="Remove from saved"
                >
                    <X className="w-4 h-4 text-red-500" />
                </button>
                {property.featured && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        Featured
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {property.title}
                    </h3>
                    <span className="text-lg font-bold text-green-700 whitespace-nowrap ml-2">
                        {property.formattedprice}
                    </span>
                </div>

                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm line-clamp-1">{property.location}</span>
                    </div>

                    <div className="text-sm text-gray-700 mb-4">
                        {property.category}
                    </div>
                </div>

                {/* <div className="flex items-center gap-4 text-sm text-gray-700 mb-3">
                    <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center">
                        <Home className="w-4 h-4 mr-1" />
                        <span>{property.area} sqft</span>
                    </div>
                </div> */}

                <div className="flex gap-2">
                    <button
                        onClick={handleAddToComparison}
                        className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Compare
                    </button>
                    <button
                        onClick={() => router.push(ROUTES.PROPERTIES.DETAIL(propertyId))}
                        className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}
