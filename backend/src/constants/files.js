// File Validation Configuration
// Organized configuration for different file types with allowed types, size limits, and count limits

// Multiple Images Upload Configuration
export const IMAGES_CONFIG = {
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'],
    maxSize: 5 * 1024 * 1024, // 5MB per image
    maxCount: 10,
};

// Video Upload Configuration
export const VIDEO_CONFIG = {
    allowedTypes: ['video/mp4', 'video/webm', 'video/avi'],
    maxSize: 50 * 1024 * 1024, // 50MB
    maxCount: 1,
};

// Document Upload Configuration
export const DOCUMENT_CONFIG = {
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize: 10 * 1024 * 1024, // 10MB
    maxCount: 1,
};