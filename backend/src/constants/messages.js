// HTTP Response Messages
// Centralized message constants for consistent API responses

export const AUTH_MESSAGES = {
    // Success messages
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    PROFILE_FETCHED: 'Profile fetched successfully',
    PROFILE_UPDATED: 'Profile updated successfully',

    // Error messages
    MISSING_FIELDS: 'Please fill all the fields',
    USER_EXISTS: 'User already exists with this email',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    MISSING_EMAIL_PASSWORD: 'Please provide email and password',
    NO_TOKEN: 'Access denied, no token provided',
    INVALID_TOKEN: 'Invalid token',
    ACCESS_DENIED_DEALER: 'Access denied. Dealer Role required.',
};

export const PROPERTY_MESSAGES = {
    // Success messages
    PROPERTY_CREATED: 'Property created successfully',
    PROPERTY_UPDATED: 'Property updated successfully',
    PROPERTY_DELETED: 'Property deleted successfully',
    PROPERTIES_FETCHED: 'Properties fetched successfully',
    PROPERTY_FETCHED: 'Property fetched successfully',

    // Error messages
    PROPERTY_NOT_FOUND: 'Property not found',
    UNAUTHORIZED_ACCESS: 'You are not authorized to perform this action',
    MISSING_FIELDS: 'Please provide all required fields',
    NO_IMAGES: 'Please upload at least one image',
    UPLOAD_FAILED: 'Image upload failed',
};

export const ENQUIRY_MESSAGES = {
    ENQUIRY_CREATED: 'Enquiry created successfully',
    ENQUIRIES_FETCHED: 'Enquiries fetched successfully',
    ERROR_CREATING: 'Error creating enquiry',
    ERROR_FETCHING: 'Error fetching enquiries',
};

export const SUBSCRIPTION_MESSAGES = {
    SUBSCRIPTION_CREATED: 'Subscription created successfully',
    SUBSCRIPTION_FETCHED: 'Subscription fetched successfully',
    ERROR_CREATING: 'Error creating subscription',
    ERROR_FETCHING: 'Error fetching subscription',
};

export const GENERAL_MESSAGES = {
    INTERNAL_ERROR: 'Internal server error',
    INVALID_REQUEST: 'Invalid request',
};
