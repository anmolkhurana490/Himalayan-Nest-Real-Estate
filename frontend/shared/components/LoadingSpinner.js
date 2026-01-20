// Loading Spinner Component - Global loading indicator
// Displays overlay with spinner during API calls and page transitions

'use client';

import React from 'react';
import { useAppStore } from '@/shared/stores/appStore';

const LoadingSpinner = () => {
    const { loading } = useAppStore();

    if (!loading) return null;

    return (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="text-gray-700 font-medium">Loading...</span>
            </div>
        </div>
    );
};

export default LoadingSpinner;
