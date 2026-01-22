// Dashboard Overview View - Main dashboard with statistics and recent properties
// Re-exported from app/dashboard/overview/page.js to follow MVVM architecture

"use client";
import React, { useState, useEffect } from 'react';
import { usePropertyViewModel } from '@/features/properties/viewmodel/propertyViewModel';
import { useRouter } from 'next/navigation';
import ROUTES from '@/config/constants/routes';
import { BriefcaseBusiness, Building, Circle, CircleCheck, Eye, MessageCircleMore, Plus } from 'lucide-react';

const DashboardOverviewView = () => {
    const { getMyProperties } = usePropertyViewModel();
    const [stats, setStats] = useState({
        totalProperties: 0,
        activeProperties: 0,
        totalViews: 0,
        totalQueries: 0
    });
    const [recentProperties, setRecentProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const result = await getMyProperties();

            if (result && result.success) {
                const properties = result.data?.properties || [];
                const activeProperties = properties.filter(p => p.isActive);

                setStats({
                    totalProperties: properties.length,
                    activeProperties: activeProperties.length,
                    totalViews: properties.reduce((sum, p) => sum + (p.views || 0), 0),
                    totalQueries: properties.reduce((sum, p) => sum + (p.queries || 0), 0)
                });

                // Get recent properties (last 5)
                setRecentProperties(properties.slice(0, 5));
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color = "green" }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
                    {icon}
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div> */}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-sm p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard!</h2>
                <p className="text-green-100">
                    Manage your properties, respond to queries, and grow your real estate business.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Properties"
                    value={stats.totalProperties}
                    color="green"
                    icon={
                        <Building className="w-6 h-6" />
                    }
                />
                <StatCard
                    title="Active Listings"
                    value={stats.activeProperties}
                    color="blue"
                    icon={
                        <CircleCheck className="w-6 h-6" />
                    }
                />
                <StatCard
                    title="Total Views"
                    value={stats.totalViews}
                    color="purple"
                    icon={
                        <Eye className="w-6 h-6" />
                    }
                />
                <StatCard
                    title="Queries"
                    value={stats.totalQueries}
                    color="yellow"
                    icon={
                        <MessageCircleMore className="w-6 h-6" />
                    }
                />
            </div>

            {/* Recent Properties */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Recent Properties</h3>
                </div>
                <div className="p-4 sm:p-6">
                    {recentProperties.length > 0 ? (
                        <div className="space-y-4">
                            {recentProperties.map((property) => (
                                <div key={property.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Building className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">{property.title}</h4>
                                            <p className="text-xs sm:text-sm text-gray-500 truncate">{property.location} • {property.category}</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-x-3 sm:gap-6 sm:flex-shrink-0'>
                                        <div className="flex justify-between items-center w-full sm:w-auto sm:text-right">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">₹{property.price}</p>
                                            </div>
                                            <span className={`inline-flex px-2 py-1 ml-2 text-xs font-medium rounded-full ${property.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {property.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => router.push(ROUTES.DASHBOARD.PROPERTY_DETAIL(property.id))}
                                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium self-start sm:self-center whitespace-nowrap"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Building className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-sm sm:text-base px-4">No properties found. Start by adding your first property!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => router.push(ROUTES.DASHBOARD.CREATE_PROPERTY)}
                        className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Property
                    </button>

                    <button
                        onClick={() => router.push(ROUTES.DASHBOARD.PROPERTIES)}
                        className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <BriefcaseBusiness className="w-5 h-5 mr-2" />
                        Manage Properties
                    </button>

                    <button
                        onClick={() => router.push(ROUTES.DASHBOARD.QUERIES)}
                        className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <MessageCircleMore className="w-5 h-5 mr-2" />
                        View Queries
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverviewView;
