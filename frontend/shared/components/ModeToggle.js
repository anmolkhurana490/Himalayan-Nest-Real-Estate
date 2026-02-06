// Mode Toggle Component - Switch between Buyer and Seller modes
// Displays toggle switch for customers to switch between buyer/seller views

"use client";
import React from 'react';
import { useAuthStore } from '@/shared/stores/authStore';
import { ShoppingCart, Home } from 'lucide-react';

const ModeToggle = () => {
    const { user, viewMode, toggleViewMode } = useAuthStore();

    // Only show for customers (not dealers or admins)
    if (!user || user.role === 'dealer' || user.role === 'admin') {
        return null;
    }

    const isBuyerMode = viewMode === 'buyer';

    return (
        <div className="flex items-center gap-2">
            <span className={`text-xs sm:text-sm font-medium transition-colors ${isBuyerMode ? 'text-blue-600' : 'text-gray-500'}`}>
                Buyer
            </span>

            <button
                onClick={toggleViewMode}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                style={{
                    backgroundColor: isBuyerMode ? '#3b82f6' : '#10b981'
                }}
                aria-label={`Switch to ${isBuyerMode ? 'seller' : 'buyer'} mode`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isBuyerMode ? 'translate-x-1' : 'translate-x-6'
                        }`}
                >
                    {isBuyerMode ? (
                        <ShoppingCart className="w-3 h-3 text-blue-600 m-0.5" />
                    ) : (
                        <Home className="w-3 h-3 text-green-600 m-0.5" />
                    )}
                </span>
            </button>

            <span className={`text-xs sm:text-sm font-medium transition-colors ${!isBuyerMode ? 'text-green-600' : 'text-gray-500'}`}>
                Seller
            </span>
        </div>
    );
};

export default ModeToggle;
