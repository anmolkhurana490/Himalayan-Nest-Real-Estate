// Validation Constants
// Validation rules, limits, regex patterns, and allowed file types

// Validation Limits
export const VALIDATION_LIMITS = {
    TITLE_MIN_LENGTH: 10,
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MIN_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 2000,
    PRICE_MIN: 0,
    PRICE_MAX: 1000000000, // 100 crore
    IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    IMAGE_MAX_COUNT: 20,
    VIDEO_MAX_SIZE: 50 * 1024 * 1024, // 50MB
    PHONE_LENGTH: 10,
};

// File Types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/avi'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Regular Expressions
export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[6-9]\d{9}$/,
    PIN_CODE: /^[1-9][0-9]{5}$/,
    ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
    PRICE: /^\d+(\.\d{1,2})?$/,
    URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
};
