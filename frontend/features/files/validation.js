// File Validation Utilities
// Client-side file validation for uploads

import { z } from 'zod';
import {
    IMAGES_CONFIG,
    VIDEO_CONFIG,
    DOCUMENT_CONFIG
} from '@/config/constants/files';

/**
 * Validate single image file
 */
export const validateSingleImage = (file) => {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    if (!IMAGES_CONFIG.allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Only JPEG, PNG, WEBP, and AVIF are allowed`
        };
    }

    if (file.size > IMAGES_CONFIG.maxSize) {
        return {
            valid: false,
            error: `File size exceeds ${IMAGES_CONFIG.maxSize / (1024 * 1024)}MB limit`
        };
    }

    return { valid: true };
};

/**
 * Validate multiple image files
 */
export const validateMultipleImages = (files) => {
    if (!files || files.length === 0) {
        return { valid: false, error: 'No files provided' };
    }

    if (files.length > IMAGES_CONFIG.maxCount) {
        return {
            valid: false,
            error: `Maximum ${IMAGES_CONFIG.maxCount} images allowed`
        };
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!IMAGES_CONFIG.allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: `Invalid file type. Only JPEG, PNG, WEBP, and AVIF are allowed`,
                fileName: file.name
            };
        }

        if (file.size > IMAGES_CONFIG.maxSize) {
            return {
                valid: false,
                error: `File size exceeds ${IMAGES_CONFIG.maxSize / (1024 * 1024)}MB limit`,
                fileName: file.name
            };
        }
    }

    return { valid: true };
};

/**
 * Validate video file
 */
export const validateVideo = (file) => {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    if (!VIDEO_CONFIG.allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Only MP4, WEBM, and AVI are allowed`
        };
    }

    if (file.size > VIDEO_CONFIG.maxSize) {
        return {
            valid: false,
            error: `File size exceeds ${VIDEO_CONFIG.maxSize / (1024 * 1024)}MB limit`
        };
    }

    return { valid: true };
};

/**
 * Validate document file
 */
export const validateDocument = (file) => {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    if (!DOCUMENT_CONFIG.allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Only PDF and Word documents are allowed`
        };
    }

    if (file.size > DOCUMENT_CONFIG.maxSize) {
        return {
            valid: false,
            error: `File size exceeds ${DOCUMENT_CONFIG.maxSize / (1024 * 1024)}MB limit`
        };
    }

    return { valid: true };
};

// Legacy function names for backward compatibility
export const validateImageFile = validateSingleImage;
export const validateImageFiles = validateMultipleImages;
export const validateVideoFile = validateVideo;
export const validateDocumentFile = validateDocument;

// Zod schemas for file validation
export const singleImageSchema = z.instanceof(File)
    .refine(file => IMAGES_CONFIG.allowedTypes.includes(file.type), {
        message: 'Invalid file type. Only JPEG, PNG, WEBP, and AVIF are allowed'
    })
    .refine(file => file.size <= IMAGES_CONFIG.maxSize, {
        message: `File size must be less than ${IMAGES_CONFIG.maxSize / (1024 * 1024)}MB`
    });

export const multipleImagesSchema = z.array(z.instanceof(File)
    .refine(file => IMAGES_CONFIG.allowedTypes.includes(file.type), {
        message: 'Invalid file type. Only JPEG, PNG, WEBP, and AVIF are allowed'
    })
    .refine(file => file.size <= IMAGES_CONFIG.maxSize, {
        message: `File size must be less than ${IMAGES_CONFIG.maxSize / (1024 * 1024)}MB`
    }))
    .min(1, 'At least one image is required')
    .max(IMAGES_CONFIG.maxCount, `Maximum ${IMAGES_CONFIG.maxCount} images allowed`);

export const videoSchema = z.instanceof(File)
    .refine(file => VIDEO_CONFIG.allowedTypes.includes(file.type), {
        message: 'Invalid file type. Only MP4, WEBM, and AVI are allowed'
    })
    .refine(file => file.size <= VIDEO_CONFIG.maxSize, {
        message: `File size must be less than ${VIDEO_CONFIG.maxSize / (1024 * 1024)}MB`
    });

export const documentSchema = z.instanceof(File)
    .refine(file => DOCUMENT_CONFIG.allowedTypes.includes(file.type), {
        message: 'Invalid file type. Only PDF and Word documents are allowed'
    })
    .refine(file => file.size <= DOCUMENT_CONFIG.maxSize, {
        message: `File size must be less than ${DOCUMENT_CONFIG.maxSize / (1024 * 1024)}MB`
    });

// Legacy schema names for backward compatibility
export const imageFileSchema = singleImageSchema;
export const imageFilesSchema = multipleImagesSchema;
export const videoFileSchema = videoSchema;
export const documentFileSchema = documentSchema;
