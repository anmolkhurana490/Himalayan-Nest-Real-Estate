// Property-related Constants
// Property types, categories, statuses, and features

// Property Categories/Types
export const PROPERTY_CATEGORIES = {
    RESIDENTIAL: 'Residential',
    COMMERCIAL: 'Commercial',
    LAND: 'Land',
    INDUSTRIAL: 'Industrial',
};

// Property Purpose
export const PROPERTY_PURPOSE = {
    SALE: 'sale',
    RENT: 'rent',
};

// Property Sub-types
export const PROPERTY_SUBTYPES = {
    RESIDENTIAL: ['Apartment', 'Villa', 'House', 'Flat', 'Penthouse', 'Studio'],
    COMMERCIAL: ['Office', 'Shop', 'Showroom', 'Warehouse', 'Mall Space'],
    LAND: ['Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land'],
    INDUSTRIAL: ['Factory', 'Manufacturing Unit', 'Warehouse', 'Industrial Shed'],
};

// Legacy Property Types (for backward compatibility with existing forms)
export const LEGACY_PROPERTY_TYPES = [
    { value: 'flat', label: 'Flat/Apartment' },
    { value: 'house', label: 'House/Villa' },
    { value: 'plot', label: 'Plot/Land' },
    { value: 'pg', label: 'PG/Hostel' },
    { value: 'commercial', label: 'Commercial' },
];

// Property Listing Status
export const PROPERTY_STATUS = {
    SALE: 'Sale',
    RENT: 'Rent',
    SOLD: 'Sold',
    RENTED: 'Rented',
};

// Property Availability Status
export const AVAILABILITY_STATUS = {
    AVAILABLE: 'available',
    SOLD: 'sold',
    UNDER_NEGOTIATION: 'under_negotiation',
    OFF_MARKET: 'off_market',
};

// Property Features
export const PROPERTY_FEATURES = {
    FURNISHED: 'Furnished',
    SEMI_FURNISHED: 'Semi-Furnished',
    UNFURNISHED: 'Unfurnished',
    CORNER_PLOT: 'Corner Plot',
    MAIN_ROAD_FACING: 'Main Road Facing',
    PARK_FACING: 'Park Facing',
    VASTU_COMPLIANT: 'Vastu Compliant',
    NEW_CONSTRUCTION: 'New Construction',
    READY_TO_MOVE: 'Ready to Move',
    UNDER_CONSTRUCTION: 'Under Construction',
};

// Area Units
export const AREA_UNITS = {
    SQFT: 'sq.ft',
    SQYD: 'sq.yd',
    SQM: 'sq.m',
    ACRE: 'acre',
    HECTARE: 'hectare',
    BIGHA: 'bigha',
    MARLA: 'marla',
};

// Transaction Types
export const TRANSACTION_TYPES = {
    NEW_BOOKING: 'new_booking',
    RESALE: 'resale',
    DIRECT_OWNER: 'direct_owner',
    BROKER: 'broker',
};

// Sort Options
export const SORT_OPTIONS = {
    NEWEST: 'newest',
    OLDEST: 'oldest',
    PRICE_LOW_HIGH: 'price_low_high',
    PRICE_HIGH_LOW: 'price_high_low',
    AREA_LOW_HIGH: 'area_low_high',
    AREA_HIGH_LOW: 'area_high_low',
    MOST_VIEWED: 'most_viewed',
    FEATURED: 'featured',
};

// Price Ranges
export const PRICE_RANGES = {
    MIN: 500, // 500 INR
    MAX: 1000000000, // 100 Crores
};