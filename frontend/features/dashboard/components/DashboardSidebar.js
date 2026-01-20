"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ROUTES from '@/config/constants/routes';
import { Building, ChartNoAxesGantt, MessageCircleMore, MoveLeft, Plus, UserRound, X } from 'lucide-react';

const DashboardSidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
    const router = useRouter();

    const menuItems = [
        {
            id: 'overview',
            label: 'Overview',
            icon: (
                <ChartNoAxesGantt className="w-5 h-5" />
            )
        },
        {
            id: 'properties',
            label: 'My Properties',
            icon: (
                <Building className="w-5 h-5" />
            )
        },
        {
            id: 'create-property',
            label: 'Add Property',
            icon: (
                <Plus className="w-5 h-5" />
            )
        },
        {
            id: 'queries',
            label: 'Queries & Leads',
            icon: (
                <MessageCircleMore className="w-5 h-5" />
            )
        },
        {
            id: 'profile',
            label: 'Profile Settings',
            icon: (
                <UserRound className="w-5 h-5" />
            )
        }
    ];

    const handleMenuClick = (tabId) => {
        router.push(`${ROUTES.DASHBOARD.ROOT}/${tabId}`);
        setActiveTab(tabId);
        setIsSidebarOpen(false);
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <Link href={ROUTES.HOME} className="text-xl font-bold text-green-700">
                        Himalayan Nest
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="mt-8">
                    <div className="px-4 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleMenuClick(item.id)}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                {item.icon}
                                <span className="ml-3">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Back to Main Site */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <Link
                        href={ROUTES.PROPERTIES}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <MoveLeft />
                        <span className="ml-3">Back to Main Site</span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default DashboardSidebar;
