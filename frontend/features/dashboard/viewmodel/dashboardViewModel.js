// Dashboard ViewModel - Business logic for dashboard
// Handles business logic for dashboard operations using repositories

import { create } from 'zustand';
import { DashboardStats, Activity, AnalyticsData } from '../model/dashboardModel';
import * as dashboardRepo from '../repositories';
import { useAppStore } from '@/shared/stores/appStore';

export const useDashboardViewModel = create((set, get) => ({
    // State
    stats: null,
    activities: [],
    analytics: null,
    error: null,

    // Actions
    setStats: (stats) => set({ stats }),
    setActivities: (activities) => set({ activities }),
    setAnalytics: (analytics) => set({ analytics }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    /**
     * Get dashboard stats
     */
    getDashboardStats: async () => {
        try {
            useAppStore.getState().setLoading(true);
            set({ error: null });

            const data = await dashboardRepo.getDashboardStatsAPI();
            const stats = new DashboardStats(data.stats || data);

            set({ stats });

            return {
                success: true,
                data: data,
                stats,
                message: data.message || 'Dashboard stats fetched successfully'
            };
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch dashboard stats';
            set({ error: errorMessage });
            return {
                success: false,
                error: errorMessage,
                message: 'Failed to fetch dashboard stats'
            };
        } finally {
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Get recent activities
     */
    getRecentActivities: async (limit = 10) => {
        try {
            useAppStore.getState().setLoading(true);
            set({ error: null });

            const data = await dashboardRepo.getRecentActivitiesAPI(limit);
            const activities = (data.activities || data.data || []).map(a => new Activity(a));

            set({ activities });

            return {
                success: true,
                data: data,
                activities,
                message: data.message || 'Activities fetched successfully'
            };
        } catch (error) {
            console.error('Get activities error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch activities';
            set({ error: errorMessage });
            return {
                success: false,
                message: errorMessage,
            };
        } finally {
            useAppStore.getState().setLoading(false);
        }
    },

    /**
     * Get analytics data
     */
    getAnalytics: async (timeframe = '30d') => {
        try {
            useAppStore.getState().setLoading(true);
            set({ error: null });

            const data = await dashboardRepo.getAnalyticsAPI(timeframe);
            const analytics = new AnalyticsData(data.analytics || data);

            set({ analytics });

            return {
                success: true,
                data: data,
                analytics,
                message: data.message || 'Analytics fetched successfully'
            };
        } catch (error) {
            console.error('Get analytics error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch analytics';
            set({ error: errorMessage });
            return {
                success: false,
                message: errorMessage,
            };
        } finally {
            useAppStore.getState().setLoading(false);
        }
    }
}));
