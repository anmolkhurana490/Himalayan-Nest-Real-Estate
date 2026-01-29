"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ROUTES from '@/config/constants/routes';
import { Building, ChartNoAxesGantt, MessageCircleMore, MoveLeft, Plus, UserRound } from 'lucide-react';

const DashboardSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [activeTab, setActiveTab] = useState("overview"); // Current active dashboard section

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

    useEffect(() => {
        if (!pathname) return;
        const pathParts = pathname.split('/');

        // Determine active tab based on URL path
        for (let i = 0; i < pathParts.length; i++) {
            if (menuItems.some(item => item.id === pathParts[i])) {
                setActiveTab(pathParts[i]);
                return;
            }
        }
    }, [pathname]);

    const handleMenuClick = (tabId) => {
        router.push(`${ROUTES.DASHBOARD.ROOT}/${tabId}`);
        setActiveTab(tabId);
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:static lg:inset-0">
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
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
                <nav className="flex justify-around items-center gap-1 h-16 px-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleMenuClick(item.id)}
                            className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${activeTab === item.id
                                ? 'text-green-700'
                                : 'text-gray-600'
                                }`}
                        >
                            <div className={`p-1.5 rounded-lg ${activeTab === item.id
                                ? 'bg-green-100'
                                : ''
                                }`}>
                                {item.icon}
                            </div>
                            <span className="mt-1 max-sm:hidden px-1">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default DashboardSidebar;
