// Dashboard Header Component - Top navigation for dealer dashboard
// Provides mobile menu toggle, user profile dropdown, and dashboard title

"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/authStore';
import { useAppStore } from '@/shared/stores/appStore';
import ROUTES from '@/config/constants/routes';
import { ChevronDown, Menu } from 'lucide-react';

const DashboardHeader = ({ setIsSidebarOpen }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // User dropdown menu toggle
    const user = useAuthStore((state) => state.user);
    const clearUser = useAuthStore((state) => state.clearUser);
    const router = useRouter();

    // Logout functionality (currently commented out)
    // const handleLogout = async () => {
    //     try {
    //         setLoading(true);
    //         const result = await logoutUser();

    //         if (result && result.success) {
    //             setUser(null);
    //             router.push('/');
    //         } else {
    //             console.error('Logout failed:', result?.error || result?.message);
    //             setUser(null);
    //             router.push('/');
    //         }
    //     } catch (error) {
    //         console.error('Logout error:', error);
    //         setUser(null);
    //         router.push('/');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Mobile menu button */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden text-gray-500 hover:text-gray-700 mr-2"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Page title */}
                <div className="flex-1 lg:flex-none">
                    <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
                        Dealer Dashboard
                    </h1>
                </div>

                {/* User menu */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-medium">
                                {user?.name?.charAt(0) || user?.firstName?.charAt(0) || 'D'}
                            </span>
                        </div>
                        <div className="hidden lg:flex lg:flex-col lg:items-start">
                            <span className="text-gray-900 font-medium">
                                {user?.name || `${user?.firstName} ${user?.lastName}` || 'Dealer'}
                            </span>
                            <span className="text-gray-500 text-xs">
                                {user?.email}
                            </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100 lg:hidden">
                                <div className="font-medium">{user?.name || `${user?.firstName} ${user?.lastName}` || 'Dealer'}</div>
                                <div className="text-gray-500">{user?.email}</div>
                            </div>

                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    // You can add profile edit functionality here
                                    router.push(ROUTES.DASHBOARD.PROFILE);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Edit Profile
                            </button>

                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    router.push(ROUTES.PROPERTIES.ROOT);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                View Properties Site
                            </button>

                            {/* <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    handleLogout();
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                Sign Out
                            </button> */}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
