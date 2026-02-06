// Property Validation Schemas using Zod
// Input validation schemas for property endpoints

import { file, z } from 'zod';
import { PROPERTY_CATEGORIES, PROPERTY_PURPOSES, PROPERTY_SUBTYPES } from '../../../constants/property.js';

const CATEGORY_VALUES = Object.values(PROPERTY_CATEGORIES);
const PURPOSE_VALUES = Object.values(PROPERTY_PURPOSES);

export const createPropertyValidation = z.object({
    title: z.string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string'
    })
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title must be at most 200 characters'),

    description: z.string()
        .max(2000, 'Description must be at most 2000 characters')
        .optional()
        .default(''),

    category: z.enum(CATEGORY_VALUES, {
        required_error: 'Category is required',
        invalid_type_error: 'Invalid category'
    }),

    property_subtype: z.string()
        .optional(),

    purpose: z.enum(PURPOSE_VALUES, {
        required_error: 'Purpose is required',
        invalid_type_error: 'Invalid purpose'
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
        .max(200, 'Location must be at most 200 characters'),

}).superRefine((data, ctx) => {
    // Validate property_subtype if provided and not empty
    if (data.property_subtype && data.property_subtype.trim() !== '') {
        const validSubtypes = PROPERTY_SUBTYPES[data.category.toUpperCase()];

        if (!validSubtypes || !validSubtypes.includes(data.property_subtype)) {
            ctx.addIssue({
                path: ['property_subtype'],
                message: `Invalid property subtype for ${data.category}. Valid subtypes are: ${validSubtypes ? validSubtypes.join(', ') : 'none'}`
            });
        }
    }
});

export const updatePropertyValidation = z.object({
    title: z.string()
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title must be at most 200 characters')
        .optional(),

    description: z.string()
        .max(2000, 'Description must be at most 2000 characters')
        .optional(),

    category: z.enum(CATEGORY_VALUES, {
        required_error: 'Category is required',
        invalid_type_error: 'Invalid category'
    }),

    property_subtype: z.string()
        .max(100, 'Property subtype must be at most 100 characters')
        .optional(),

    purpose: z.enum(PURPOSE_VALUES)
        .optional(),

    price: z.coerce.number()
        .positive('Price must be positive')
        .min(0, 'Price cannot be negative')
        .optional(),

    location: z.string()
        .min(2, 'Location must be at least 2 characters')
        .max(200, 'Location must be at most 200 characters')
        .optional(),

    isActive: z.coerce.boolean()
        .optional(),

    imagesToDelete: z.string()
        .transform((val) => {
            try {
                return JSON.parse(val);
            } catch {
                throw new Error('imagesToDelete must be a valid JSON string');
            }
        })
        .pipe(
            z.array(z.string()
                .pipe(z.url('Each image to delete must be a valid URL'))
            )
        )
        .optional(),

}).partial().superRefine((data, ctx) => {
    // Validate property_subtype if provided and not empty
    if (data.property_subtype && data.property_subtype.trim() !== '') {
        const validSubtypes = PROPERTY_SUBTYPES[data.category.toUpperCase()];

        if (!validSubtypes || !validSubtypes.includes(data.property_subtype)) {
            ctx.addIssue({
                path: ['property_subtype'],
                message: `Invalid property subtype for ${data.category}. Valid subtypes are: ${validSubtypes ? validSubtypes.join(', ') : 'none'}`
            });
        }
    }
});

export const searchPropertyValidation = z.object({
    keywords: z.string()
        .max(200, 'Keywords must be at most 200 characters')
        .optional(),

    location: z.string()
        .max(100, 'Location must be at most 100 characters')
        .optional(),

    category: z.enum(CATEGORY_VALUES)
        .optional(),

    purpose: z.enum([...PURPOSE_VALUES, 'buy'])
        .optional(),

    minPrice: z.coerce.number()
        .min(0, 'Minimum price cannot be negative')
        .optional(),

    maxPrice: z.coerce.number()
        .min(0, 'Maximum price cannot be negative')
        .optional(),

    budget: z.coerce.number()
        .min(0, 'Budget cannot be negative')
        .optional()
}).partial();
