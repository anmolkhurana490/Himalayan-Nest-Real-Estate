// File Upload Middleware using Multer and Cloudinary
// Handles property image uploads with automatic optimization and cloud storage

import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'himalayan-nest/properties', // Organized folder structure in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 1200, height: 800, crop: 'limit' }, // Resize large images to standard size
            { quality: 'auto' } // Auto quality optimization for faster loading
        ],
        public_id: (req, file) => {
            // Generate unique filename to prevent conflicts
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            return `property_${timestamp}_${randomString}`;
        }
    }
});

// File filter function to validate uploaded files
const fileFilter = (req, file, cb) => {
    // List of allowed image MIME types
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WebP images are allowed.'), false);
    }
};

// Configure multer with Cloudinary storage
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file (Cloudinary handles optimization)
        files: 10 // Maximum 10 files
    },
    fileFilter: fileFilter
});

// Middleware for multiple file upload
export const uploadPropertyImages = upload.array('images', 10);

// Middleware for single file upload
export const uploadSingleImage = upload.single('image');

// Error handling middleware for multer
export const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 10MB per file.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum 10 files allowed.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected field name for file upload.'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Multer error: ' + error.message
        });
    }

    if (error.message.includes('Invalid file type')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message: 'File upload error: ' + error.message
    });
};

// Utility function to delete images from Cloudinary
export const deleteCloudinaryImages = async (imageUrls) => {
    try {
        const deletePromises = imageUrls.map(async (imageUrl) => {
            // Extract public_id from Cloudinary URL
            const publicId = extractPublicIdFromUrl(imageUrl);
            if (publicId) {
                return await cloudinary.uploader.destroy(publicId);
            }
        });

        const results = await Promise.all(deletePromises);
        // console.log('Cloudinary deletion results:', results);
        return results;
    } catch (error) {
        console.error('Error deleting images from Cloudinary:', error.message);
        throw error;
    }
};

// Helper function to extract public_id from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    // Get the last part and remove the file extension
    return parts.pop().split('.')[0];
};