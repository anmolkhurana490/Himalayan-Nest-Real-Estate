// Application route constants
// Centralized route definitions for consistent navigation throughout the app

const ROUTES = {
    // Public routes
    HOME: '/',
    PROPERTIES: '/properties',
    ABOUT: '/home/about',
    CONTACT: '/home/contact',

    // Auth routes
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',

    // Premium features (future)
    PREMIUM: '/premium',
    INSIGHTS: '/insights',
    CALCULATOR: '/calculator',
    ALERTS: '/alerts',

    // Dashboard routes
    DASHBOARD: {
        ROOT: '/dashboard',
        OVERVIEW: '/dashboard/overview',
        PROPERTIES: '/dashboard/properties',
        CREATE_PROPERTY: '/dashboard/create-property',
        QUERIES: '/dashboard/queries',
        PROFILE: '/dashboard/profile',

        // Dynamic routes
        PROPERTY_DETAIL: (id) => `/dashboard/properties/${id}`,
    },

    // Dynamic public routes
    PROPERTY_DETAIL: (id) => `/properties/${id}`,

    // Query params helpers
    PROPERTIES_WITH_FILTERS: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const queryString = params.toString();
        return `/properties${queryString ? `?${queryString}` : ''}`;
    },
};

export default ROUTES;
