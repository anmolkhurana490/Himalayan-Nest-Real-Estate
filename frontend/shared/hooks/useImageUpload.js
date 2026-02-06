// useImageUpload Hook - Reusable image upload and preview management
// Eliminates duplicate image handling logic in CreateProperty and EditProperty

import { useState } from 'react';
import { IMAGES_CONFIG } from '@/config/constants/files';

/**
 * Custom hook for handling image uploads with preview generation
 * Uses centralized configuration from files constants
 * 
 * @param {Array} initialImages - Initial images (for edit mode)
 * 
 * @returns {Object} Image state and handlers
 * 
 * @example
 * const { images, previews, errors, handleImageSelect, removeImage, clearImages } = useImageUpload();
 */
export const useImageUpload = (initialImages = []) => {
    const maxImages = IMAGES_CONFIG.maxCount;
    const maxSizeBytes = IMAGES_CONFIG.maxSize;
    const maxSizeMB = maxSizeBytes / (1024 * 1024);
    const acceptedFormats = IMAGES_CONFIG.allowedTypes;

    const [images, setImages] = useState(initialImages);
    const [previews, setPreviews] = useState([]);
    const [errors, setErrors] = useState([]);

    /**
     * Validate single image file
     */
    const validateImage = (file) => {
        const errors = [];

        // Check file type
        if (!acceptedFormats.includes(file.type)) {
            errors.push(`${file.name}: Invalid format. Accepted: ${acceptedFormats.join(', ')}`);
        }

        // Check file size
        if (file.size > maxSizeBytes) {
            const sizeMB = file.size / (1024 * 1024);
            errors.push(`${file.name}: File too large (${sizeMB.toFixed(2)}MB). Max: ${maxSizeMB.toFixed(0)}MB`);
        }

        return errors;
    };

    /**
     * Generate preview URL for image file
     */
    const generatePreview = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    /**
     * Handle image file selection
     */
    const handleImageSelect = async (event) => {
        const files = Array.from(event.target.files || []);
        const validationErrors = [];

        // Check total count
        if (images.length + files.length > maxImages) {
            setErrors([`Maximum ${maxImages} images allowed. You can add ${maxImages - images.length} more.`]);
            return;
        }

        // Validate each file
        const validFiles = [];
        for (const file of files) {
            const fileErrors = validateImage(file);
            if (fileErrors.length === 0) {
                validFiles.push(file);
            } else {
                validationErrors.push(...fileErrors);
            }
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Generate previews
        try {
            const newPreviews = await Promise.all(
                validFiles.map(file => generatePreview(file))
            );

            setImages(prev => [...prev, ...validFiles]);
            setPreviews(prev => [...prev, ...newPreviews]);
            setErrors([]);
        } catch (error) {
            setErrors(['Failed to generate image previews']);
            console.error('Preview generation error:', error);
        }
    };

    /**
     * Remove image at index
     */
    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
        setErrors([]);
    };

    /**
     * Clear all images
     */
    const clearImages = () => {
        setImages([]);
        setPreviews([]);
        setErrors([]);
    };

    /**
     * Update images (for edit mode)
     */
    const setInitialImages = (newImages, newPreviews = []) => {
        setImages(newImages);
        setPreviews(newPreviews);
        setErrors([]);
    };

    return {
        images,
        previews,
        errors,
        handleImageSelect,
        removeImage,
        clearImages,
        setInitialImages,
        hasImages: images.length > 0,
        imageCount: images.length,
        canAddMore: images.length < maxImages,
        remainingSlots: maxImages - images.length,
    };
};

export default useImageUpload;
