/**
 * Customer Dashboard View
 * Main dashboard for customer account with mode-aware content
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/authStore';
import { useCustomerViewModel } from '@/features/customer/viewmodel/customerViewModel';
import { useSavedPropertiesViewModel } from '@/features/savedProperties/viewmodel/savedPropertiesViewModel';
import { usePropertyViewModel } from '@/features/properties/viewmodel/propertyViewModel';
import { Heart, Home, MessageSquare, Settings, TrendingUp, Eye } from 'lucide-react';
import ROUTES from '@/config/constants/routes';
import Link from 'next/link';

export default function CustomerDashboardView() {
    const router = useRouter();
    const { user, viewMode } = useAuthStore();
    const { initializeCustomerData } = useCustomerViewModel();
    const { savedProperties, getSavedProperties } = useSavedPropertiesViewModel();
    const { myProperties, getMyProperties } = usePropertyViewModel();
    const [stats, setStats] = useState({
        savedCount: 0,
        listingsCount: 0,
        enquiriesCount: 0,
        viewsCount: 0,
    });

    useEffect(() => {
        const loadData = async () => {
            await initializeCustomerData();
            await getSavedProperties();
            if (viewMode === 'seller') {
                await getMyProperties();
            }
        };
        loadData();
    }, [viewMode]);

    useEffect(() => {
        setStats({
            savedCount: savedProperties.length,
            listingsCount: myProperties.length,
            enquiriesCount: 0,
            viewsCount: myProperties.reduce((acc, prop) => acc + (prop.views || 0), 0),
        });
    }, [savedProperties, myProperties]);

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-2 sm:px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user.firstName || user.name}!
                    </h1>
                    <p className="text-gray-600">
                        {viewMode === 'buyer'
                            ? 'Browse and save your favorite properties'
                            : 'Manage your property listings and enquiries'}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
                    {viewMode === 'buyer' ? (
                        <>
                            <StatCard
                                icon={<Heart className="w-6 h-6 sm:w-8 sm:h-8" />}
                                title="Saved Properties"
                                value={stats.savedCount}
                                color="red"
                                link={ROUTES.ACCOUNT.SAVED}
                            />
                            <StatCard
                                icon={<MessageSquare className="w-6 h-6 sm:w-8 sm:h-8" />}
                                title="Enquiries Sent"
                                value={stats.enquiriesCount}
                                color="blue"
                                link={ROUTES.ACCOUNT.ENQUIRIES}
                            />
                        </>
                    ) : (
                        <>
                            <StatCard
                                icon={<Home className="w-6 h-6 sm:w-8 sm:h-8" />}
                                title="My Listings"
                                value={stats.listingsCount}
                                color="green"
                                link={ROUTES.ACCOUNT.PROPERTIES}
                            />
                            <StatCard
                                icon={<Eye className="w-6 h-6 sm:w-8 sm:h-8" />}
                                title="Total Views"
                                value={stats.viewsCount}
                                color="purple"
                            />
                            <StatCard
                                icon={<MessageSquare className="w-6 h-6 sm:w-8 sm:h-8" />}
                                title="Enquiries"
                                value={stats.enquiriesCount}
                                color="blue"
                                link={ROUTES.ACCOUNT.ENQUIRIES}
                            />
                            <StatCard
                                icon={<TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />}
                                title="Active Listings"
                                value={myProperties.filter(p => p.isActive).length}
                                color="orange"
                            />
                        </>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {viewMode === 'buyer' ? (
                            <>
                                <QuickActionCard
                                    icon={<Home className="w-6 h-6" />}
                                    title="Browse Properties"
                                    link={ROUTES.PROPERTIES.ROOT}
                                />
                                <QuickActionCard
                                    icon={<Heart className="w-6 h-6" />}
                                    title="Saved Properties"
                                    link={ROUTES.ACCOUNT.SAVED}
                                />
                                <QuickActionCard
                                    icon={<MessageSquare className="w-6 h-6" />}
                                    title="My Enquiries"
                                    link={ROUTES.ACCOUNT.ENQUIRIES}
                                />
                                <QuickActionCard
                                    icon={<Settings className="w-6 h-6" />}
                                    title="Settings"
                                    link={ROUTES.ACCOUNT.SETTINGS}
                                />
                            </>
                        ) : (
                            <>
                                <QuickActionCard
                                    icon={<Home className="w-6 h-6" />}
                                    title="My Listings"
                                    link={ROUTES.ACCOUNT.PROPERTIES}
                                />
                                <QuickActionCard
                                    icon={<TrendingUp className="w-6 h-6" />}
                                    title="Add Property"
                                    link={ROUTES.ACCOUNT.ADD_PROPERTY}
                                />
                                <QuickActionCard
                                    icon={<MessageSquare className="w-6 h-6" />}
                                    title="Enquiries"
                                    link={ROUTES.ACCOUNT.ENQUIRIES}
                                />
                                <QuickActionCard
                                    icon={<Settings className="w-6 h-6" />}
                                    title="Settings"
                                    link={ROUTES.ACCOUNT.SETTINGS}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                    <div className="text-center py-8 text-gray-500">
                        <p>No recent activity yet</p>
                        <Link
                            href={viewMode === 'buyer' ? ROUTES.PROPERTIES.ROOT : ROUTES.ACCOUNT.ADD_PROPERTY}
                            className="mt-4 inline-block text-green-600 hover:text-green-700 font-medium"
                        >
                            {viewMode === 'buyer' ? 'Start browsing properties' : 'Add your first property'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, color, link }) {
    const colorClasses = {
        red: 'bg-red-100 text-red-600',
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600',
    };

    const content = (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className={`${colorClasses[color]} w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-xs sm:text-sm text-gray-600">{title}</p>
        </div>
    );

    return link ? <Link href={link}>{content}</Link> : content;
}

function QuickActionCard({ icon, title, link }) {
    return (
        <Link
            href={link}
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
        >
            <div className="text-gray-600 group-hover:text-green-600 mb-2">
                {icon}
            </div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-green-700 text-center">
                {title}
            </p>
        </Link>
    );
}
