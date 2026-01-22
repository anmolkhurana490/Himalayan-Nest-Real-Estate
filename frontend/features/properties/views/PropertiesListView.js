// Properties List View - Browse and search properties
"use client";
import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchFilterBar from '@/shared/components/SearchFilterBar'
import { useAppStore } from '@/shared/stores/appStore'
import { usePropertyViewModel } from '@/features/properties/viewmodel/propertyViewModel'
import PropertyCard from '@/shared/components/PropertyCard';

const PropertiesLoading = () => (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Properties</h1>
                <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="mt-2 text-gray-600">Loading properties...</p>
            </div>
        </div>
    </div>
);

const PropertiesContent = () => {
    const { getProperties, properties: vmProperties } = usePropertyViewModel();
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState(Object.fromEntries(searchParams.entries()));

    const loadProperties = async (searchFilters) => {
        setError('');

        let result = await getProperties(searchFilters || filters);

        if (result && result.success) {
            let propertiesData = result.data?.properties || result.data || [];
            setProperties(propertiesData);
            setTotalPages(result.data?.totalPages || 1);
            setCurrentPage(result.data?.currentPage || 1);
        } else {
            const errorMessage = result?.message || 'Failed to load properties';
            setError(errorMessage);
            setProperties([]);
        }
    };

    useEffect(() => {
        loadProperties();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Properties</h1>
                    <SearchFilterBar onSearch={loadProperties} searchParams={searchParams} />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {properties.length === 0 && !error && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property.id || property._id} property={property} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function PropertiesListView() {
    return (
        <Suspense fallback={<PropertiesLoading />}>
            <PropertiesContent />
        </Suspense>
    );
}
