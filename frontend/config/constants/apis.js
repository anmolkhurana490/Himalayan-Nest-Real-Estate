// API Endpoints Configuration
// Centralized API endpoint constants for the application

// Base API URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    CHECK_EMAIL: (email) => `/auth/check-email/${email}`,
    OAUTH_RESOLVE: '/auth/oauth-resolve',
    VERIFY_SESSION: '/auth/verify',
    GET_PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
};

// Property Endpoints
export const PROPERTY_ENDPOINTS = {
    GET_ALL: '/properties',
    GET_BY_ID: (id) => `/properties/${id}`,
    GET_BY_IDS: (ids) => `/properties?ids=${ids.join(',')}`,
    CREATE: '/properties',
    UPDATE: (id) => `/properties/${id}`,
    DELETE: (id) => `/properties/${id}`,
    SEARCH: '/properties/search',
    FEATURED: '/properties/featured',
    MY_PROPERTIES: '/properties/my-properties',
};

// Enquiry Endpoints
export const ENQUIRY_ENDPOINTS = {
    SUBMIT: '/enquiries',
    GET_ALL: '/enquiries',
    GET_BY_ID: (id) => `/enquiries/${id}`,
    UPDATE_STATUS: (id) => `/enquiries/${id}/status`,
    DELETE: (id) => `/enquiries/${id}`,
    GET_PROPERTY_ENQUIRIES: (propertyId) => `/enquiries/property/${propertyId}`,
};

// Subscription Endpoints
export const SUBSCRIPTION_ENDPOINTS = {
    SUBSCRIBE: '/subscriptions',
    GET_ALL: '/subscriptions',
    UNSUBSCRIBE: (email) => `/subscriptions/${email}`,
};

export { API_BASE_URL };
