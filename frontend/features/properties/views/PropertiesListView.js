// Properties List View - Browse and search properties
"use client";
import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchFilterBar from '@/features/properties/components/SearchFilterBar'
import { useAppStore } from '@/shared/stores/appStore'
import { usePropertyViewModel } from '@/features/properties/viewmodel/propertyViewModel'
import PropertyCard from '@/features/properties/components/PropertyCard';
import { searchPropertySchema } from '../validation';
import { validateWithSchema } from '@/utils/validator';
import Pagination from '../components/Pagination';
import APP_CONFIG from '@/config/app.config';
import { toast } from 'sonner';

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
    const { getProperties } = usePropertyViewModel();
    const [properties, setProperties] = useState([]);
    const searchParams = useSearchParams();

    const [paginationValues, setPaginationValues] = useState({});

    const loadProperties = async (searchFilters = {}) => {
        const filters = {};
        Object.entries(searchFilters).forEach(([key, value]) => {
            if (value && value.toString().trim()) {
                filters[key] = value;
            }
        });

        const errors = validateWithSchema(searchPropertySchema, filters);
        if (errors && errors.length > 0) {
            const errorMessage = errors.map((e) => e.message).join('\\n');
            toast.error(errorMessage);
            return;
        }

        const options = {
            limit: parseInt(searchParams.get('limit')) || APP_CONFIG.DEFAULT_PAGE_SIZE,
            page: parseInt(searchParams.get('page')) || 1
        }

        let result = await getProperties(searchFilters || filters, options);

        if (result && result.success) {
            let propertiesData = result.properties || result.data || [];
            setProperties(propertiesData);

            setPaginationValues({
                limit: options.limit,
                currPage: options.page,
                totalPages: result.totalPages
            });
        } else {
            const errorMessage = result?.message || 'Failed to load properties';
            toast.error(errorMessage);
            setProperties([]);
        }
    };

    useEffect(() => {
        const filters = Object.fromEntries(searchParams.entries());
        loadProperties(filters);
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Properties</h1>
                    <SearchFilterBar onSearch={loadProperties} searchParams={searchParams} />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
                {properties.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property.id || property._id} property={property} />
                    ))}
                </div>
            </div>

            {properties.length > 0 && <Pagination values={paginationValues} />}
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
