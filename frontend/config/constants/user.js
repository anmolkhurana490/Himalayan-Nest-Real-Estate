// User and Authentication Constants
// User roles, enquiry statuses, and contact preferences

// User Roles
export const USER_ROLES = {
    BUYER: 'buyer',
    RENTER: 'renter',
    SELLER: 'seller',
    DEALER: 'dealer',
};

// Enquiry Statuses
export const ENQUIRY_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in-progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed',
};

// Enquiry Priority Levels
export const ENQUIRY_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
};

// Contact Preferences
export const CONTACT_PREFERENCES = {
    PHONE: 'phone',
    EMAIL: 'email',
    WHATSAPP: 'whatsapp',
    IN_PERSON: 'in_person',
};

// Verification Status
export const VERIFICATION_STATUS = {
    VERIFIED: 'verified',
    PENDING: 'pending',
    REJECTED: 'rejected',
    UNVERIFIED: 'unverified',
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
    FREE: 'free',
    BASIC: 'basic',
    PREMIUM: 'premium',
    ENTERPRISE: 'enterprise',
};

// Subscription Features
export const SUBSCRIPTION_FEATURES = {
    FREE: {
        listingLimit: 5,
        featuredListings: 0,
        photosPerListing: 5,
        videoSupport: false,
        prioritySupport: false,
        analytics: false,
    },
    BASIC: {
        listingLimit: 20,
        featuredListings: 2,
        photosPerListing: 10,
        videoSupport: true,
        prioritySupport: false,
        analytics: true,
    },
    PREMIUM: {
        listingLimit: 100,
        featuredListings: 10,
        photosPerListing: 20,
        videoSupport: true,
        prioritySupport: true,
        analytics: true,
    },
    ENTERPRISE: {
        listingLimit: -1, // unlimited
        featuredListings: -1, // unlimited
        photosPerListing: 50,
        videoSupport: true,
        prioritySupport: true,
        analytics: true,
    },
};
