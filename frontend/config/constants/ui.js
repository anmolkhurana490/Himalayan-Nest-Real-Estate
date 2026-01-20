// UI and Display Constants
// Amenities, locations, price ranges, and other UI-related constants

// Property Amenities
export const AMENITIES = {
    SECURITY: '24/7 Security',
    PARKING: 'Parking',
    POWER_BACKUP: 'Power Backup',
    WATER_SUPPLY: '24/7 Water Supply',
    ELEVATOR: 'Elevator/Lift',
    SWIMMING_POOL: 'Swimming Pool',
    GYMNASIUM: 'Gymnasium',
    PLAY_AREA: "Children's Play Area",
    CLUBHOUSE: 'Clubhouse',
    GARDEN: 'Garden/Park',
    CCTV: 'CCTV Surveillance',
    INTERCOM: 'Intercom Facility',
    FIRE_SAFETY: 'Fire Safety',
    MAINTENANCE_STAFF: 'Maintenance Staff',
    VISITOR_PARKING: 'Visitor Parking',
    CONFERENCE_ROOM: 'Conference Room',
    CAFETERIA: 'Cafeteria',
    AC: 'Air Conditioning',
    WIFI: 'Wi-Fi/Internet',
    GATED_COMMUNITY: 'Gated Community',
};

// Amenities as Array (for selection)
export const AMENITIES_LIST = Object.values(AMENITIES);

// Common Residential Amenities
export const RESIDENTIAL_AMENITIES = [
    AMENITIES.SECURITY,
    AMENITIES.PARKING,
    AMENITIES.POWER_BACKUP,
    AMENITIES.WATER_SUPPLY,
    AMENITIES.ELEVATOR,
    AMENITIES.SWIMMING_POOL,
    AMENITIES.GYMNASIUM,
    AMENITIES.PLAY_AREA,
    AMENITIES.CLUBHOUSE,
    AMENITIES.GARDEN,
    AMENITIES.CCTV,
    AMENITIES.INTERCOM,
    AMENITIES.GATED_COMMUNITY,
];

// Common Commercial Amenities
export const COMMERCIAL_AMENITIES = [
    AMENITIES.SECURITY,
    AMENITIES.PARKING,
    AMENITIES.POWER_BACKUP,
    AMENITIES.ELEVATOR,
    AMENITIES.CCTV,
    AMENITIES.FIRE_SAFETY,
    AMENITIES.VISITOR_PARKING,
    AMENITIES.CONFERENCE_ROOM,
    AMENITIES.CAFETERIA,
    AMENITIES.AC,
    AMENITIES.WIFI,
];

// Popular Locations (Uttarakhand focus)
export const POPULAR_LOCATIONS = [
    'Dehradun',
    'Haridwar',
    'Roorkee',
    'Rishikesh',
    'Mussoorie',
    'Nainital',
    'Haldwani',
    'Rudrapur',
    'Kashipur',
    'Ramnagar',
];

// Price Ranges (for filters)
export const PRICE_RANGES = [
    { label: 'Under ₹10 Lakh', min: 0, max: 1000000 },
    { label: '₹10 Lakh - ₹25 Lakh', min: 1000000, max: 2500000 },
    { label: '₹25 Lakh - ₹50 Lakh', min: 2500000, max: 5000000 },
    { label: '₹50 Lakh - ₹1 Crore', min: 5000000, max: 10000000 },
    { label: '₹1 Crore - ₹2 Crore', min: 10000000, max: 20000000 },
    { label: 'Above ₹2 Crore', min: 20000000, max: null },
];

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
};

// Date Formats
export const DATE_FORMATS = {
    DISPLAY: 'DD/MM/YYYY',
    DISPLAY_WITH_TIME: 'DD/MM/YYYY hh:mm A',
    API: 'YYYY-MM-DD',
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
};
