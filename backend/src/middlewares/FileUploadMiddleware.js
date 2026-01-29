// File Upload Middleware using Multer
// Handles file uploads using memory storage for validation before cloud upload

import multer from 'multer';
import { IMAGES_CONFIG, VIDEO_CONFIG, DOCUMENT_CONFIG } from '../constants/files.js';

// Use memory storage - files stored in buffer temporarily for validation
const storage = multer.memoryStorage();

// File filter function for images
const imageFileFilter = (req, file, cb) => {
    if (IMAGES_CONFIG.allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid image type. Allowed types: ${IMAGES_CONFIG.allowedTypes.join(', ')}`), false);
    }
};

// File filter function for videos
const videoFileFilter = (req, file, cb) => {
    if (VIDEO_CONFIG.allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid video type. Allowed types: ${VIDEO_CONFIG.allowedTypes.join(', ')}`), false);
    }
};

// File filter function for documents
const documentFileFilter = (req, file, cb) => {
    if (DOCUMENT_CONFIG.allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid document type. Allowed types: ${DOCUMENT_CONFIG.allowedTypes.join(', ')}`), false);
    }
};

// Configure multer for image uploads
const imageUpload = multer({
    storage: storage,
    limits: {
        fileSize: IMAGES_CONFIG.maxSize,
        files: IMAGES_CONFIG.maxCount
    },
    fileFilter: imageFileFilter
});

// Configure multer for video uploads
const videoUpload = multer({
    storage: storage,
    limits: {
        fileSize: VIDEO_CONFIG.maxSize,
        files: VIDEO_CONFIG.maxCount
    },
    fileFilter: videoFileFilter
});

// Configure multer for document uploads
const documentUpload = multer({
    storage: storage,
    limits: {
        fileSize: DOCUMENT_CONFIG.maxSize,
        files: DOCUMENT_CONFIG.maxCount
    },
    fileFilter: documentFileFilter
});

// Middleware for multiple image upload
export const uploadPropertyImages = imageUpload.array('images', IMAGES_CONFIG.maxCount);

// Middleware for single image upload
export const uploadSingleImage = imageUpload.single('image');

// Middleware for video upload
export const uploadPropertyVideo = videoUpload.single('video');

// Middleware for document upload
export const uploadPropertyDocument = documentUpload.single('document');

// Error handling middleware for multer
export const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: `File size too large. Maximum size is ${IMAGES_CONFIG.maxSize / (1024 * 1024)}MB per file.`
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: `Too many files. Maximum ${IMAGES_CONFIG.maxCount} files allowed.`
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected field name for file upload.'
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    if (error.message.includes('Invalid')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    next();
};