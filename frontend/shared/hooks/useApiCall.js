// useApiCall Hook - Standardized API call wrapper with loading and error handling
// Eliminates duplicate try-catch blocks across viewmodels

import { useAppStore } from '@/shared/stores/appStore';

/**
 * Parse error response to extract error message
 * Handles different error response structures consistently
 */
const parseError = (error, fallbackMessage = 'An error occurred') => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.data?.message) {
        return error.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return fallbackMessage;
};

/**
 * Custom hook for making API calls with standardized loading and error handling
 * 
 * @returns {Function} apiCall - Function to execute API calls with loading/error handling
 * 
 * @example
 * const apiCall = useApiCall();
 * const result = await apiCall(
 *   () => someRepositoryFunction(params),
 *   { errorMessage: 'Failed to fetch data' }
 * );
 */
export const useApiCall = () => {
    /**
     * Execute API call with loading and error handling
     * 
     * @param {Function} apiFunc - The API function to execute
     * @param {Object} options - Configuration options
     * @param {boolean} options.showLoading - Whether to show global loading state (default: true)
     * @param {string} options.errorMessage - Fallback error message
     * @param {Function} options.onSuccess - Optional success callback
     * @param {Function} options.onError - Optional error callback
     * @param {Function} options.onFinally - Optional finally callback
     * 
     * @returns {Promise<{success: boolean, data?: any, error?: string}>}
     */
    const apiCall = async (apiFunc, options = {}) => {
        const {
            showLoading = true,
            errorMessage = 'Operation failed',
            onSuccess,
            onError,
            onFinally
        } = options;

        try {
            if (showLoading) {
                useAppStore.getState().setLoading(true);
            }

            const result = await apiFunc();

            if (onSuccess) {
                await onSuccess(result);
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            console.error('API call error:', error);
            const parsedError = parseError(error, errorMessage);

            if (onError) {
                await onError(parsedError);
            }

            return {
                success: false,
                error: parsedError
            };
        } finally {
            if (showLoading) {
                useAppStore.getState().setLoading(false);
            }

            if (onFinally) {
                await onFinally();
            }
        }
    };

    return apiCall;
};

export default useApiCall;
