// Dashboard Model - Data models for dashboard
// Defines the structure for dashboard data

export class DashboardStats {
    constructor(data = {}) {
        this.totalProperties = data.totalProperties || 0;
        this.totalEnquiries = data.totalEnquiries || 0;
        this.pendingEnquiries = data.pendingEnquiries || 0;
        this.activeListings = data.activeListings || 0;
        this.viewsCount = data.viewsCount || 0;
        this.revenue = data.revenue || 0;
    }
}

export class Activity {
    constructor(data = {}) {
        this.id = data.id || data._id || null;
        this.type = data.type || '';
        this.description = data.description || '';
        this.timestamp = data.timestamp || data.createdAt || null;
        this.user = data.user || null;
        this.metadata = data.metadata || {};
    }

    get formattedTime() {
        if (!this.timestamp) return '';
        return new Date(this.timestamp).toLocaleString();
    }
}

export class AnalyticsData {
    constructor(data = {}) {
        this.views = data.views || [];
        this.enquiries = data.enquiries || [];
        this.conversions = data.conversions || [];
        this.timeframe = data.timeframe || '30d';
    }
}
