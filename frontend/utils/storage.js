// Local Storage Utilities
// Helper functions for browser local storage operations

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @returns {any} Parsed value or null
 */
export const getFromStorage = (key) => {
    if (typeof window === 'undefined') return null;

    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
};

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setInStorage = (key, value) => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error writing to localStorage:', error);
    }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeFromStorage = (key) => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
};

/**
 * Clear all localStorage
 */
export const clearStorage = () => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};
