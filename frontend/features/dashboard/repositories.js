// Dashboard Repository - API integrations for dashboard
// Handles all HTTP requests related to dashboard operations

import api from '@/config/api.config';

/**
 * Get dashboard overview stats
 */
export const getDashboardStatsAPI = async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
};

/**
 * Get recent activities
 */
export const getRecentActivitiesAPI = async (limit = 10) => {
    const response = await api.get('/dashboard/activities', { params: { limit } });
    return response.data;
};

/**
 * Get analytics data
 */
export const getAnalyticsAPI = async (timeframe = '30d') => {
    const response = await api.get('/dashboard/analytics', { params: { timeframe } });
    return response.data;
};
