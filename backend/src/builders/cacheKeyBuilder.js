// Generates Redis keys with specific templates

// Generate key for authenticated user session
export const generateAuthSessionKey = (userId = '*', sessionId = '*') => {
    return `session:${userId}:${sessionId}`;
}

// Generate key for Property detail
export const generatePropertyKey = (propertyId = '*') => {
    return `property:${propertyId}`;
}