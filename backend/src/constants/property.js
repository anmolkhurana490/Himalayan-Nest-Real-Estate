// Property Related Constants
// Defines valid categories, purposes, and other property-related enums

export const PROPERTY_CATEGORIES = {
    RESIDENTIAL: 'residential',
    COMMERCIAL: 'commercial',
    LAND: 'land',
    INDUSTRIAL: 'industrial',
};

export const PROPERTY_SUBTYPES = {
    RESIDENTIAL: ['apartment', 'villa', 'house', 'flat', 'penthouse', 'studio'],
    COMMERCIAL: ['office', 'shop', 'showroom', 'warehouse', 'mall space'],
    LAND: ['residential plot', 'commercial plot', 'agricultural land', 'industrial land'],
    INDUSTRIAL: ['factory', 'manufacturing unit', 'warehouse', 'industrial shed'],
};

export const PROPERTY_PURPOSES = {
    RENT: 'rent',
    SALE: 'sale',
};

// Property Association Attributes for Sequelize Models
export const PROPERTY_ASSOCIATIONS_ATTRIBUTES = ['id', 'title', 'category', 'purpose', 'price', 'location'];

// Enquiry Status Constants
export const ENQUIRY_STATUS = {
    PENDING: 'pending',
    RESPONDED: 'responded',
    CLOSED: 'closed',
    REJECTED: 'rejected',
    EXPIRED: 'expired',
};

export const MESSAGE = {
    minLength: 5,
    maxLength: 1000,
}

export const PROPERTY_REDIS_EXPIRY_SECONDS = 60 * 60; // 1 hour in seconds