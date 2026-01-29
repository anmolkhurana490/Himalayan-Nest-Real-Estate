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

// Image optimization (quality settings)
export const IMAGE_QUALITY = {
    THUMBNAIL: 60,
    MEDIUM: 75,
    HIGH: 90,
};

// Image dimensions for different use cases
export const IMAGE_SIZES = {
    THUMBNAIL: { width: 400, height: 300 },
    CARD: { width: 800, height: 600 },
    DETAIL: { width: 1200, height: 900 },
};