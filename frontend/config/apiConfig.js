// Axios Configuration for API Communication
// Configures HTTP client with base URL, authentication, and error handling

import axios from "axios";
import { API_BASE_URL } from "./constants/apis";

// Create axios instance with default configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json', // Default content type (overridden for file uploads)
    },
    withCredentials: true, // Include HTTP-only cookies for authentication
});

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
            console.error('Network Error:', error.message);
            return Promise.reject({ message: 'Network error. Please try again later.' });
        }
    }
);

export default api;
