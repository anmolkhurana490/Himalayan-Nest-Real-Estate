// Cloudinary Configuration for Image Storage
// Configures Cloudinary service for uploading and managing property images

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY,       // API key for authentication
    api_secret: process.env.CLOUDINARY_API_SECRET, // API secret for secure operations
});

export default cloudinary;