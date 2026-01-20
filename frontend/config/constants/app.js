// Application Constants - Central Export Point
// This file re-exports all constants from their respective modules for convenience
// For better organization, constants are split into:
// - property.js: Property types, categories, statuses
// - user.js: User roles, enquiries, subscriptions
// - validation.js: Validation rules, regex, file types
// - messages.js: Error and success messages
// - ui.js: Amenities, locations, UI-related constants

// Re-export from property module
export {
    PROPERTY_CATEGORIES,
    PROPERTY_CATEGORIES_LIST,
    PROPERTY_SUBTYPES,
    LEGACY_PROPERTY_TYPES,
    PROPERTY_STATUS,
    AVAILABILITY_STATUS,
    PROPERTY_FEATURES,
    AREA_UNITS,
    TRANSACTION_TYPES,
    SORT_OPTIONS,
} from './property';

// Re-export from user module
export {
    USER_ROLES,
    ENQUIRY_STATUS,
    ENQUIRY_PRIORITY,
    CONTACT_PREFERENCES,
    VERIFICATION_STATUS,
    SUBSCRIPTION_PLANS,
    SUBSCRIPTION_FEATURES,
} from './user';

// Re-export from validation module
export {
    VALIDATION_LIMITS,
    ALLOWED_IMAGE_TYPES,
    ALLOWED_VIDEO_TYPES,
    ALLOWED_DOCUMENT_TYPES,
    REGEX,
} from './validation';

// Re-export from messages module
export {
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
} from './messages';

// Re-export from ui module
export {
    AMENITIES,
    AMENITIES_LIST,
    RESIDENTIAL_AMENITIES,
    COMMERCIAL_AMENITIES,
    POPULAR_LOCATIONS,
    PRICE_RANGES,
    PAGINATION,
    DATE_FORMATS,
} from './ui';

// Default export for importing all constants at once
export { default as PROPERTY_CONSTANTS } from './property';
export { default as USER_CONSTANTS } from './user';
export { default as VALIDATION_CONSTANTS } from './validation';
export { default as MESSAGE_CONSTANTS } from './messages';
export { default as UI_CONSTANTS } from './ui';

