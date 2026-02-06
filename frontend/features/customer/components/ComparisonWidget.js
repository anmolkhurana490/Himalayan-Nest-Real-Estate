/**
 * Comparison Widget Component
 * Shows properties added to comparison list
 */

'use client';

import { X, ArrowRight } from 'lucide-react';
import { useCustomerViewModel } from '../viewmodel/customerViewModel';
import { useRouter } from 'next/navigation';
import ROUTES from '@/config/constants/routes';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ComparisonWidget() {
    const router = useRouter();
    const { comparisonList, removeFromComparison, clearComparison } = useCustomerViewModel();

    if (comparisonList.length === 0) {
        return null;
    }

    const handleCompare = () => {
        router.push(ROUTES.ACCOUNT.COMPARISON);
    };

    const handleRemove = (propertyId) => {
        const result = removeFromComparison(propertyId);
        if (result?.success) {
            toast.success('Property removed from comparison');
        }
    };

    const handleClear = () => {
        const result = clearComparison();
        if (result?.success) {
            toast.success('Comparison cleared');
        }
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-[90%] sm:max-w-sm z-50">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">
                    Compare Properties ({comparisonList.length}/4)
                </h3>
                <button
                    onClick={handleClear}
                    className="text-gray-500 hover:text-red-500"
                    title="Clear all"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                {comparisonList.map((property) => (
                    <div
                        key={property.id}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                    >
                        <img
                            src={property.image || '/images/property-placeholder.jpg'}
                            alt={property.title}
                            className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {property.title}
                            </p>
                            <p className="text-xs text-gray-600">
                                {property.formattedprice}
                            </p>
                        </div>
                        <button
                            onClick={() => handleRemove(property.id)}
                            className="text-gray-400 hover:text-red-500"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={handleCompare}
                disabled={comparisonList.length < 2}
                className={`
                    w-full py-2 rounded flex items-center justify-center gap-2
                    ${comparisonList.length >= 2
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                    transition-colors
                `}
            >
                Compare Now
                <ArrowRight className="w-4 h-4" />
            </button>

            {comparisonList.length < 2 && (
                <p className="text-xs text-gray-500 text-center mt-2">
                    Add at least 2 properties to compare
                </p>
            )}
        </div>
    );
}
