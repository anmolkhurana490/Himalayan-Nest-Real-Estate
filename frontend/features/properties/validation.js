// Property Validation Schemas
// Client-side validation using Zod (matching backend validation rules)

import { z } from 'zod';
import { PROPERTY_CATEGORIES, PROPERTY_SUBTYPES, PROPERTY_PURPOSE } from '@/config/constants/property';
import { imageFilesSchema } from '@/features/files/validation';

// Property categories and purposes (matching backend)
const CATEGORY_VALUES = Object.values(PROPERTY_CATEGORIES);
const PURPOSE_VALUES = Object.values(PROPERTY_PURPOSE);

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
        .refine(val => CATEGORY_VALUES.includes(val), {
            message: 'Please select a valid category'
        }),

    property_subtype: z.string()
        .optional(),

    purpose: z.enum(PURPOSE_VALUES, {
        required_error: 'Purpose is required',
        invalid_type_error: 'Invalid purpose. Must be sale or rent'
    }),

    price: z.coerce.number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number'
    })
        .positive('Price must be positive')
        .min(0, 'Price cannot be negative'),

    location: z.string({
        required_error: 'Location is required',
        invalid_type_error: 'Location must be a string'
    })
        .min(2, 'Location must be at least 2 characters')
        .max(200, 'Location must be at most 200 characters')
        .trim(),
}).superRefine((data, ctx) => {
    // Validate property_subtype if provided and not empty
    if (data.property_subtype && data.property_subtype.trim() !== '') {
        const categoryKey = data.category.toUpperCase();
        const validSubtypes = PROPERTY_SUBTYPES[categoryKey];

        if (!validSubtypes || !validSubtypes.includes(data.property_subtype)) {
            ctx.addIssue({
                path: ['property_subtype'],
                message: 'Please select a valid property sub-type for the selected category'
            });
        }
    }
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

    category: z.string({
        required_error: 'Category is required'
    })
        .refine(val => CATEGORY_VALUES.includes(val), {
            message: 'Please select a valid category'
        }),

    property_subtype: z.string()
        .optional(),

    purpose: z.enum(PURPOSE_VALUES, {
        required_error: 'Purpose is required',
        invalid_type_error: 'Invalid purpose. Must be sale or rent'
    }),

    price: z.coerce.number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number'
    })
        .positive('Price must be positive')
        .min(0, 'Price cannot be negative'),

    location: z.string()
        .min(2, 'Location must be at least 2 characters')
        .max(200, 'Location must be at most 200 characters')
        .trim()
        .optional()
}).partial().superRefine((data, ctx) => {
    // Validate property_subtype if provided and not empty
    if (data.property_subtype && data.property_subtype.trim() !== '') {
        const categoryKey = data.category.toUpperCase();
        const validSubtypes = PROPERTY_SUBTYPES[categoryKey];

        if (!validSubtypes || !validSubtypes.includes(data.property_subtype)) {
            ctx.addIssue({
                path: ['property_subtype'],
                message: 'Please select a valid property sub-type for the selected category'
            });
        }
    }
});

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
