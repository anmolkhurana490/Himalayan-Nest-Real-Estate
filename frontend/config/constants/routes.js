// Application route constants
// Centralized route definitions for consistent navigation throughout the app

const ROUTES = {
    // Public routes
    HOME: '/',
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

    // Properties routes (Public)
    PROPERTIES: {
        ROOT: '/properties',
        DETAIL: (id) => `/properties/${id}`,
        WITH_FILTERS: (filters) => {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            const queryString = params.toString();
            return `/properties${queryString ? `?${queryString}` : ''}`;
        },
    },

    // Dashboard routes (Dealers/Admins)
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

    // Customer Account routes (Buyers/Sellers)
    ACCOUNT: {
        ROOT: '/account',
        DASHBOARD: '/account/dashboard',
        SAVED: '/account/saved',
        PROPERTIES: '/account/properties',
        ADD_PROPERTY: '/account/add-property',
        ENQUIRIES: '/account/enquiries',
        SETTINGS: '/account/settings',
        COMPARISON: '/account/comparison',

        // Dynamic routes
        PROPERTY_DETAIL: (id) => `/account/properties/${id}`,
        EDIT_PROPERTY: (id) => `/account/properties/${id}/edit`,
    },
};

ROUTES.REDIRECTS = {
    AFTER_LOGIN: ROUTES.DASHBOARD.OVERVIEW,
    AFTER_LOGOUT: ROUTES.HOME,
    AUTH_PROTECTED: ROUTES.LOGIN,
    AUTH_RESTRICTED: ROUTES.DASHBOARD.OVERVIEW,
}

export default ROUTES;
