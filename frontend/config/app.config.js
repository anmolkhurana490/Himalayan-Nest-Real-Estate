// Application Configuration
// Global application settings and constants

export const APP_CONFIG = {
    APP_NAME: 'Himalayan Nest Real Estate',
    APP_SHORT_NAME: 'Himalayan Nest',
    APP_DESCRIPTION: 'Find your perfect property in the Himalayas',

    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    PROPERTIES_PER_PAGE: 12,

    // Image optimization
    IMAGE_QUALITY: {
        THUMBNAIL: 60,
        MEDIUM: 75,
        HIGH: 90,
    },

    IMAGE_SIZES: {
        THUMBNAIL: { width: 400, height: 300 },
        CARD: { width: 800, height: 600 },
        DETAIL: { width: 1200, height: 900 },
    },

    // Property categories
    PROPERTY_CATEGORIES: [
        'Apartment',
        'Villa',
        'House',
        'Land',
        'Commercial',
    ],

    // Property statuses
    PROPERTY_STATUS: {
        SALE: 'Sale',
        RENT: 'Rent',
    },

    // User roles
    USER_ROLES: {
        ADMIN: 'admin',
        USER: 'user',
        OWNER: 'owner',
    },

    // Enquiry statuses
    ENQUIRY_STATUS: {
        PENDING: 'pending',
        IN_PROGRESS: 'in-progress',
        RESOLVED: 'resolved',
        CLOSED: 'closed',
    },
};

export default APP_CONFIG;
