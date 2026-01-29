// File Service - Cloudinary Operations
// Handles uploading and deleting files from Cloudinary

import cloudinary from '../../../config/cloudinary.js';

/**
 * Upload a single file buffer to Cloudinary
 * @param {Buffer} buffer - File buffer from multer
 * @param {String} folder - Cloudinary folder path
 * @param {Object} options - Additional upload options
 * @returns {Promise<String>} Cloudinary secure URL
 */
export const uploadToCloudinary = async (buffer, folder = 'himalayan-nest/properties', options = {}) => {
    return new Promise((resolve, reject) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const publicId = `${options.prefix || 'file'}_${timestamp}_${randomString}`;

        const uploadOptions = {
            folder: folder,
            public_id: publicId,
            transformation: options.transformation || [
                { width: 1200, height: 800, crop: 'limit' },
                { quality: 'auto' }
            ],
            resource_type: options.resource_type || 'auto',
            ...options
        };

        cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        ).end(buffer);
    });
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files - Array of multer file objects with buffers
 * @param {String} folder - Cloudinary folder path
 * @param {Object} options - Additional upload options
 * @returns {Promise<Array<String>>} Array of Cloudinary secure URLs
 */
export const uploadMultipleToCloudinary = async (files, folder = 'himalayan-nest/properties', options = {}) => {
    if (!files || files.length === 0) {
        return [];
    }

    const uploadPromises = files.map(file =>
        uploadToCloudinary(file.buffer, folder, {
            ...options,
            prefix: options.prefix || 'property'
        })
    );

    return await Promise.all(uploadPromises);
};

/**
 * Upload property images to Cloudinary
 * @param {Array} files - Array of image file buffers
 * @returns {Promise<Array<String>>} Array of image URLs
 */
export const uploadPropertyImages = async (files) => {
    return await uploadMultipleToCloudinary(files, 'himalayan-nest/properties/images', {
        prefix: 'property',
        transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' }
        ],
        resource_type: 'image'
    });
};

/**
 * Upload property video to Cloudinary
 * @param {Object} file - Video file buffer
 * @returns {Promise<String>} Video URL
 */
export const uploadPropertyVideo = async (file) => {
    if (!file) return null;

    return await uploadToCloudinary(file.buffer, 'himalayan-nest/properties/videos', {
        prefix: 'property_video',
        resource_type: 'video',
        transformation: null // No transformation for videos
    });
};

/**
 * Upload property document to Cloudinary
 * @param {Object} file - Document file buffer
 * @returns {Promise<String>} Document URL
 */
export const uploadPropertyDocument = async (file) => {
    if (!file) return null;

    return await uploadToCloudinary(file.buffer, 'himalayan-nest/properties/documents', {
        prefix: 'property_doc',
        resource_type: 'raw', // Documents are uploaded as raw files
        transformation: null
    });
};

/**
 * Extract public_id from Cloudinary URL
 * @param {String} url - Cloudinary URL
 * @returns {String|null} Public ID or null
 */
const extractPublicIdFromUrl = (url) => {
    try {
        // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/public_id.jpg
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');

        if (uploadIndex === -1) return null;

        // Get everything after 'upload/v1234567890/' or 'upload/'
        const pathAfterUpload = parts.slice(uploadIndex + 1);

        // Remove version if present (v1234567890)
        const pathParts = pathAfterUpload[0].startsWith('v') ? pathAfterUpload.slice(1) : pathAfterUpload;

        // Join the folder and filename, then remove extension
        const fullPath = pathParts.join('/');
        const publicId = fullPath.substring(0, fullPath.lastIndexOf('.')) || fullPath;

        return publicId;
    } catch (error) {
        console.error('Error extracting public_id from URL:', error.message);
        return null;
    }
};

/**
 * Delete a single file from Cloudinary
 * @param {String} fileUrl - Cloudinary file URL
 * @param {String} resourceType - Type of resource (image, video, raw)
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFromCloudinary = async (fileUrl, resourceType = 'image') => {
    try {
        const publicId = extractPublicIdFromUrl(fileUrl);

        if (!publicId) {
            throw new Error('Could not extract public_id from URL');
        }

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });

        return result;
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error.message);
        throw error;
    }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array<String>} imageUrls - Array of Cloudinary image URLs
 * @returns {Promise<Array>} Array of deletion results
 */
export const deleteCloudinaryImages = async (imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) {
        return [];
    }

    try {
        const deletePromises = imageUrls.map(async (imageUrl) => {
            return await deleteFromCloudinary(imageUrl, 'image');
        });

        const results = await Promise.all(deletePromises);
        return results;
    } catch (error) {
        console.error('Error deleting images from Cloudinary:', error.message);
        // throw error;
    }
};

/**
 * Delete video from Cloudinary
 * @param {String} videoUrl - Cloudinary video URL
 * @returns {Promise<Object>} Deletion result
 */
export const deleteCloudinaryVideo = async (videoUrl) => {
    return await deleteFromCloudinary(videoUrl, 'video');
};

/**
 * Delete document from Cloudinary
 * @param {String} documentUrl - Cloudinary document URL
 * @returns {Promise<Object>} Deletion result
 */
export const deleteCloudinaryDocument = async (documentUrl) => {
    return await deleteFromCloudinary(documentUrl, 'raw');
};

export default {
    uploadToCloudinary, uploadMultipleToCloudinary, uploadPropertyImages, uploadPropertyVideo, uploadPropertyDocument,
    deleteFromCloudinary, deleteCloudinaryImages, deleteCloudinaryVideo, deleteCloudinaryDocument
};
