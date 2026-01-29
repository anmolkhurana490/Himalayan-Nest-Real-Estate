// Property Related Constants
// Defines valid categories, purposes, and other property-related enums

export const PROPERTY_CATEGORIES = {
    RESIDENTIAL: 'Residential',
    COMMERCIAL: 'Commercial',
    LAND: 'Land',
    INDUSTRIAL: 'Industrial',
};

export const PROPERTY_SUBTYPES = {
    RESIDENTIAL: ['Apartment', 'Villa', 'House', 'Flat', 'Penthouse', 'Studio'],
    COMMERCIAL: ['Office', 'Shop', 'Showroom', 'Warehouse', 'Mall Space'],
    LAND: ['Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land'],
    INDUSTRIAL: ['Factory', 'Manufacturing Unit', 'Warehouse', 'Industrial Shed'],
};

export const PROPERTY_PURPOSES = {
    RENT: 'rent',
    SALE: 'sale',
};

// Enquiry Status Constants
export const ENQUIRY_STATUS = {
    PENDING: 'pending',
    RESPONDED: 'responded',
    CLOSED: 'closed',
};