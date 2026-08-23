// Generates Redis keys with specific templates

// Generate key for authenticated user session
export const generateAuthSessionKey = (userId = '*', sessionId = '*') => {
    return `session:${userId}:${sessionId}`;
}

// Generate key for Property detail
export const generatePropertyKey = (propertyId) => {
    return `property:${propertyId}`;
}

// Generate key for Property detail Views
export const generatePropertyViewsKey = (propertyId) => {
    return `property:views:${propertyId}`;
}

// Generate key for Property detail Viewer (Avoid Duplicate Views for Same Property and User)
export const generateSeenPropertyVisitorKey = (propertyId, visitorId) => {
    return `views:seen:${propertyId}:${visitorId}`;
}