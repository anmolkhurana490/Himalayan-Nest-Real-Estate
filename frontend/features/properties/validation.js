// Property Validation Schemas
// Client-side validation using Zod (matching backend validation rules)

import { z } from 'zod';
import { VALIDATION_LIMITS, ALLOWED_IMAGE_TYPES } from '@/config/constants/validation';

// Property categories and purposes (matching backend)
const CATEGORY_VALUES = ['flat', 'house', 'plot', 'pg', 'farmhouse', 'villa', 'office', 'shop', 'other'];
const PURPOSE_VALUES = ['sale', 'rent'];

// Create property validation schema
export const createPropertySchema = z.object({
    title: z.string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string'
    })
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title must be at most 200 characters')
        .trim(),

    description: z.string()
        .max(2000, 'Description must be at most 2000 characters')
        .optional()
        .default(''),

    category: z.string({
        required_error: 'Category is required'
    })
        .refine(val => CATEGORY_VALUES.includes(val) || val.length > 0, {
            message: 'Please select a valid category'
        }),

    price: z.string({
        required_error: 'Price is required'
    })
        .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
            message: 'Price must be a positive number'
        }),

    location: z.string({
        required_error: 'Location is required',
        invalid_type_error: 'Location must be a string'
    })
        .min(2, 'Location must be at least 2 characters')
        .max(200, 'Location must be at most 200 characters')
        .trim(),

    image: z.any()
        .refine(file => file !== null && file !== undefined, {
            message: 'Please select a property image'
        })
        .refine(file => {
            if (!file) return false;
            return file.size <= VALIDATION_LIMITS.IMAGE_MAX_SIZE;
        }, {
            message: `Image size must be less than ${VALIDATION_LIMITS.IMAGE_MAX_SIZE / (1024 * 1024)}MB`
        })
        .refine(file => {
            if (!file) return false;
            return ALLOWED_IMAGE_TYPES.includes(file.type);
        }, {
            message: 'Invalid file type. Only JPEG, JPG, PNG, AVIF and WEBP are allowed'
        })
});

// Update property validation schema
export const updatePropertySchema = z.object({
    title: z.string()
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title must be at most 200 characters')
        .trim()
        .optional(),

    description: z.string()
        .max(2000, 'Description must be at most 2000 characters')
        .optional(),

    category: z.string()
        .optional(),

    purpose: z.string()
        .optional(),

    price: z.string()
        .refine(val => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), {
            message: 'Price must be a positive number'
        })
        .optional(),

    location: z.string()
        .min(2, 'Location must be at least 2 characters')
        .max(200, 'Location must be at most 200 characters')
        .trim()
        .optional()
}).partial();

// Search property validation schema
export const searchPropertySchema = z.object({
    keywords: z.string()
        .max(200, 'Keywords must be at most 200 characters')
        .optional(),

    location: z.string()
        .max(100, 'Location must be at most 100 characters')
        .optional(),

    category: z.string()
        .optional(),

    purpose: z.string()
        .optional(),

    minPrice: z.string()
        .refine(val => !val || !isNaN(parseFloat(val)), {
            message: 'Minimum price must be a number'
        })
        .optional(),

    maxPrice: z.string()
        .refine(val => !val || !isNaN(parseFloat(val)), {
            message: 'Maximum price must be a number'
        })
        .optional(),

    budget: z.string()
        .refine(val => !val || !isNaN(parseFloat(val)), {
            message: 'Budget must be a number'
        })
        .optional()
}).partial();
