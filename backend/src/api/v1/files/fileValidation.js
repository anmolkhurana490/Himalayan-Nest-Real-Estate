// File Validation Schemas using Zod
// Validation for file uploads (images, videos, documents)

import { z } from 'zod';
import { IMAGES_CONFIG, VIDEO_CONFIG, DOCUMENT_CONFIG } from '../../../constants/files.js';

/**
 * Validate image files for create property (at least 1 required)
 */
export const validateCreateFilesCount = (files) => {
    if (!files || files.length === 0) {
        return { valid: false, error: 'At least one image is required' };
    }

    if (files.length > IMAGES_CONFIG.maxCount) {
        return {
            valid: false,
            error: `Maximum ${IMAGES_CONFIG.maxCount} images allowed`
        };
    }

    return { valid: true };
};

/**
 * Validate image count for update property
 * @param {number} existingCount - Number of existing images
 * @param {number} uploadedCount - Number of newly uploaded images
 * @param {number} deletedCount - Number of images to delete
 */
export const validateUpdateImagesCount = (existingCount, uploadedCount, deletedCount) => {
    const totalCount = existingCount + uploadedCount - deletedCount;

    if (totalCount < 1) {
        return {
            valid: false,
            error: 'At least one image must remain after deletion'
        };
    }

    if (totalCount > IMAGES_CONFIG.maxCount) {
        return {
            valid: false,
            error: `Total images cannot exceed ${IMAGES_CONFIG.maxCount}`
        };
    }

    return { valid: true };
};

// Zod schema for image upload validation (for use with multer)
export const imageUploadSchema = z.object({
    mimetype: z.enum(IMAGES_CONFIG.allowedTypes, {
        errorMap: () => ({ message: `Invalid image type. Allowed types: ${IMAGES_CONFIG.allowedTypes.join(', ')}` })
    }),
    size: z.number()
        .max(IMAGES_CONFIG.maxSize,
            `Image size must be less than ${IMAGES_CONFIG.maxSize / (1024 * 1024)}MB`
        ),
}).loose();

// Zod schema for multiple image upload validation (for use with multer)
export const multipleImageUploadSchema = z.array(imageUploadSchema)
    .max(IMAGES_CONFIG.maxCount, `Maximum ${IMAGES_CONFIG.maxCount} images allowed`);

// Zod schema for video upload validation
export const videoUploadSchema = z.object({
    file: z.object({
        mimetype: z.enum(VIDEO_CONFIG.allowedTypes, {
            errorMap: () => ({ message: `Invalid video type. Allowed types: ${VIDEO_CONFIG.allowedTypes.join(', ')}` })
        }),
        size: z.number()
            .max(VIDEO_CONFIG.maxSize,
                `Video size must be less than ${VIDEO_CONFIG.maxSize / (1024 * 1024)}MB`
            ),
    })
});

// Zod schema for document upload validation
export const documentUploadSchema = z.object({
    file: z.object({
        mimetype: z.enum(DOCUMENT_CONFIG.allowedTypes, {
            errorMap: () => ({ message: `Invalid document type. Allowed types: ${DOCUMENT_CONFIG.allowedTypes.join(', ')}` })
        }),
        size: z.number()
            .max(DOCUMENT_CONFIG.maxSize,
                `Document size must be less than ${DOCUMENT_CONFIG.maxSize / (1024 * 1024)}MB`
            ),
    })
});
