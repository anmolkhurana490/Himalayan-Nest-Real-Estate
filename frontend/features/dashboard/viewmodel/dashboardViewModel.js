// Dashboard ViewModel - Business logic for dashboard
// Handles business logic for dashboard operations using repositories

import { DashboardStats, Activity, AnalyticsData } from '../model/dashboardModel';
import * as dashboardRepo from '../repositories';

/**
 * Get dashboard stats
 */
export const getDashboardStats = async () => {
    try {
        const data = await dashboardRepo.getDashboardStatsAPI();

        return {
            success: true,
            data: data,
            stats: new DashboardStats(data.stats || data),
            message: data.message || 'Dashboard stats fetched successfully'
        };
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch dashboard stats';
        return {
            success: false,
            error: errorMessage,
            message: 'Failed to fetch dashboard stats'
        };
    }
};

/**
 * Get recent activities
 */
export const getRecentActivities = async (limit = 10) => {
    try {
        const data = await dashboardRepo.getRecentActivitiesAPI(limit);

        return {
            success: true,
            data: data,
            activities: (data.activities || data.data || []).map(a => new Activity(a)),
            message: data.message || 'Activities fetched successfully'
        };
    } catch (error) {
        console.error('Get activities error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch activities',
        };
    }
};

/**
 * Get analytics data
 */
export const getAnalytics = async (timeframe = '30d') => {
    try {
        const data = await dashboardRepo.getAnalyticsAPI(timeframe);

        return {
            success: true,
            data: data,
            analytics: new AnalyticsData(data.analytics || data),
            message: data.message || 'Analytics fetched successfully'
        };
    } catch (error) {
        console.error('Get analytics error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch analytics',
        };
    }
};
