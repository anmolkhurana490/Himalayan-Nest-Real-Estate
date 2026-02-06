/**
 * Saved Properties View
 * Display all saved/favorite properties for buyers
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/authStore';
import { useSavedPropertiesViewModel } from '@/features/savedProperties/viewmodel/savedPropertiesViewModel';
import SavedPropertyCard from '@/features/savedProperties/components/SavedPropertyCard';
import { Heart, ArrowLeft } from 'lucide-react';
import ROUTES from '@/config/constants/routes';
import Link from 'next/link';

export default function SavedPropertiesView() {
    const router = useRouter();
    const { user, viewMode } = useAuthStore();
    const { savedProperties, getSavedProperties } = useSavedPropertiesViewModel();

    useEffect(() => {
        getSavedProperties();
    }, []);

    if (!user || user.role !== 'customer') {
        router.push(ROUTES.LOGIN);
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-2 sm:px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={ROUTES.ACCOUNT.DASHBOARD}
                        className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 text-red-600 p-3 rounded-lg">
                            <Heart className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Saved Properties
                            </h1>
                            <p className="text-gray-600">
                                {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
                            </p>
                        </div>
                    </div>
                </div>

                {/* Saved Properties Grid */}
                {savedProperties.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            No saved properties yet
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Start saving properties you're interested in to view them here
                        </p>
                        <Link
                            href={ROUTES.PROPERTIES.ROOT}
                            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            Browse Properties
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {savedProperties.map((property) => (
                            <SavedPropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}

                {/* Note about localStorage */}
                {savedProperties.length > 0 && savedProperties.length === 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                        <p className="text-blue-800 text-sm">
                            <strong>Note:</strong> You have {savedProperties.length} saved {savedProperties.length === 1 ? 'property' : 'properties'},
                            but the full details are not yet loaded. This feature will be fully functional once the backend API is connected.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
