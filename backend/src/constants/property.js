// Property Related Constants
// Defines valid categories, purposes, and other property-related enums

export const PROPERTY_CATEGORIES = {
    FLAT: 'flat',
    HOUSE: 'house',
    PLOT: 'plot',
    PG: 'pg',
    FARMHOUSE: 'farmhouse',
    VILLA: 'villa',
    OFFICE: 'office',
    SHOP: 'shop',
    OTHER: 'other',
};

export const PROPERTY_PURPOSES = {
    RENT: 'rent',
    SALE: 'sale',
};

export const CATEGORY_VALUES = Object.values(PROPERTY_CATEGORIES);
export const PURPOSE_VALUES = Object.values(PROPERTY_PURPOSES);

// Enquiry Status Constants
export const ENQUIRY_STATUS = {
    PENDING: 'pending',
    RESPONDED: 'responded',
    CLOSED: 'closed',
};

export const ENQUIRY_STATUS_VALUES = Object.values(ENQUIRY_STATUS);

// Subscription Plan Constants
export const SUBSCRIPTION_PLANS = {
    BASIC: 'basic',
    PREMIUM: 'premium',
};

export const SUBSCRIPTION_PLAN_VALUES = Object.values(SUBSCRIPTION_PLANS);
