// Image Handlers - Utilities for image URL processing and Cloudinary optimization
// Provides helper functions for handling property images, URLs, and image transformations

import { API_BASE_URL } from '../config/constants/apis';

// Helper function to construct proper image URLs
export const fetchImageUrl = (imageUrl) => {
    if (!imageUrl) return '';

    // If it's already a full URL (Cloudinary or other CDN), return as is
    if (imageUrl.startsWith('http')) return imageUrl;

    // If it's a relative path, construct full URL using backend API base URL
    const backendUrl = API_BASE_URL.replace('/api', '');
    return `${backendUrl}${imageUrl}`;
};

// Helper function to get optimized Cloudinary URL with transformations
export const getOptimizedImageUrl = (imageUrl, options = {}) => {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
        return fetchImageUrl(imageUrl);
    }

    // Default optimization options
    const { width = 800, height = 600, quality = 'auto', crop = 'fill' } = options;

    // Build Cloudinary transformation parameters
    // Example: w_800,h_600,c_fill,q_auto for responsive, optimized images
    const transformations = `w_${width},h_${height},c_${crop},q_${quality}`;

    // Insert transformation parameters into Cloudinary URL structure
    // Converts: https://res.cloudinary.com/demo/image/upload/sample.jpg
    // To: https://res.cloudinary.com/demo/image/upload/w_800,h_600,c_fill,q_auto/sample.jpg
    return imageUrl.replace('/upload/', `/upload/${transformations}/`);
};
