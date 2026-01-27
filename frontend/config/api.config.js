// Axios Configuration for API Communication
// Configures HTTP client with base URL, authentication, and error handling

import axios from "axios";
import { API_BASE_URL } from "./constants/apis";
import { getSession } from "next-auth/react";

// Create axios instance with default configuration
const api = axios.create({
    baseURL: API_BASE_URL, // Base URL for all API requests
    headers: {
        // Default content type (overridden for file uploads)
        'Content-Type': 'application/json',
    },
});

// Request interceptor to handle dynamic headers
api.interceptors.request.use(
    async (config) => {
        // JWT token from session for authenticated requests
        const session = await getSession();
        // const accessToken = getFromStorage('user')?.accessToken;

        if (session) {
            config.headers.Authorization = `Bearer ${session.user.accessToken}`;
        }

        // add cookies to every request
        // config.withCredentials = true;

        return config;
    },
    (error) => Promise.reject(error)
);

// Global response interceptor for consistent error handling
api.interceptors.response.use(
    response => response, // Pass through successful responses
    error => {
        // Handle API errors consistently across the app
        if (error.response) {
            // Server responded with error status
            return Promise.reject(error.response);
        } else {
            // Network error or request timeout
            console.error('Network Error:', error);
            return Promise.reject({ message: error.message || 'Network error. Please try again later.' });
        }
    }
);

export default api;