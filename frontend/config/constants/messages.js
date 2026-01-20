// User Messages Constants
// Error and success messages for consistent user feedback

// Error Messages
export const ERROR_MESSAGES = {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid 10-digit phone number',
    INVALID_PIN_CODE: 'Please enter a valid 6-digit PIN code',
    INVALID_PRICE: 'Please enter a valid price',
    MIN_LENGTH: (field, length) => `${field} must be at least ${length} characters`,
    MAX_LENGTH: (field, length) => `${field} must not exceed ${length} characters`,
    FILE_TOO_LARGE: (maxSize) => `File size must be less than ${maxSize}MB`,
    INVALID_FILE_TYPE: 'Invalid file type',
    NETWORK_ERROR: 'Network error. Please check your connection',
    SERVER_ERROR: 'Server error. Please try again later',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    NOT_FOUND: 'The requested resource was not found',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    PROPERTY_CREATED: 'Property created successfully',
    PROPERTY_UPDATED: 'Property updated successfully',
    PROPERTY_DELETED: 'Property deleted successfully',
    ENQUIRY_SENT: 'Your enquiry has been sent successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
    REGISTRATION_SUCCESS: 'Registration successful',
    PASSWORD_CHANGED: 'Password changed successfully',
    SUBSCRIPTION_SUCCESS: 'Subscription activated successfully',
};
