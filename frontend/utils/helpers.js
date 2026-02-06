// Common Utility Functions
// Reusable helper functions used across the application

/**
 * Format price to Indian currency format
 * @param {number} price - Price value
 * @returns {string} Formatted price
 */
export const formatPrice = (price) => {
    if (!price) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        notation: 'compact',
        compactDisplay: 'long',
        maximumFractionDigits: 2,
    }).format(price);
};

/**
 * Format date to readable format
 * @param {string} date - ISO date string
 * @param {string} length - 'short' or 'long' format, default is 'short'
 * @returns {string} Formatted date
 */
export const formatDate = (date, length = 'short') => {
    if (!date) return '';

    // Short format: 12 Jan 24
    if (length === 'short') {
        return new Date(date).toLocaleDateString('en-IN', {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
        });
    }

    // Long format: 12 January 2024
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number format (Indian)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
};

/**
 * Generate slug from text
 * @param {string} text - Text to convert
 * @returns {string} Slug
 */
export const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
