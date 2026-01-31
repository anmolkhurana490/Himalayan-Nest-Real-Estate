// Search Filter Bar Component - Advanced property search and filtering
// Provides search functionality with location, category, price, and keyword filters

"use client";
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/shared/stores/appStore';
import ROUTES from '@/config/constants/routes';
import { LEGACY_PROPERTY_TYPES } from '@/config/constants/property';

const SearchFilterBar = ({ onSearch, searchParams }) => {
    const router = useRouter();

    const [filters, setFilters] = useState({
        location: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        keywords: '',
        purpose: 'buy'
    });
    const loading = useAppStore((state) => state.loading);

    useEffect(() => {
        const initialFilters = {
            location: searchParams.get('location') || '',
            category: searchParams.get('category') || '',
            minPrice: searchParams.get('budget') || '',
            maxPrice: searchParams.get('budget') || '',
            keywords: searchParams.get('keywords') || '',
            purpose: searchParams.get('purpose') || 'buy'
        };
        setFilters(initialFilters);
    }, [searchParams]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSearch = async () => {
        setLoading(true);

        try {
            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value && value.toString().trim()) {
                    params.set(key, value);
                }
            });

            if (onSearch) {
                await onSearch(filters);
            } else {
                const queryString = params.toString();
                router.push(`/properties${queryString ? `?${queryString}` : ''}`);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            location: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            keywords: '',
            purpose: 'buy'
        };

        if (searchParams.size > 0) router.replace(ROUTES.PROPERTIES);
        setFilters(clearedFilters);
    };

    return (
        <div className="bg-white px-2 py-4 sm:px-4 rounded-lg shadow-sm border">
            <div className="flex justify-between gap-4 sm:gap-6 mb-4">
                <div className="flex gap-2">
                    <button
                        className={`px-4 py-2 rounded ${filters.purpose === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => handleFilterChange('purpose', 'buy')}
                    >
                        Buy
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${filters.purpose === 'rent' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => handleFilterChange('purpose', 'rent')}
                    >
                        Rent
                    </button>
                </div>

                <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="px-2 sm:px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                >
                    <option value="">All Categories</option>
                    {LEGACY_PROPERTY_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-4">
                <input
                    type="text"
                    placeholder="Location (e.g., Roorkee)"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="px-2 sm:px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base col-span-2 md:col-span-1"
                />

                <div className="col-span-2 grid grid-cols-2 gap-1.5 sm:gap-4">
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="px-2 sm:px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    />

                    <input
                        type="number"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="px-2 sm:px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    />
                </div>
            </div>

            <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-3">
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm sm:text-base"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
                <button
                    onClick={handleClearFilters}
                    className="px-4 sm:px-6 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-colors text-sm sm:text-base"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SearchFilterBar;
