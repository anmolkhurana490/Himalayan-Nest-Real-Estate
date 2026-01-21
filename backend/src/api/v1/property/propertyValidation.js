// Property Validation Schemas using Zod
// Input validation schemas for property endpoints

import { z } from 'zod';
import { CATEGORY_VALUES, PURPOSE_VALUES } from '../../../constants/property.js';

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
        .max(200, 'Location must be at most 200 characters')
});

export const updatePropertyValidation = z.object({
    title: z.string()
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title must be at most 200 characters')
        .optional(),

    description: z.string()
        .max(2000, 'Description must be at most 2000 characters')
        .optional(),

    category: z.enum(CATEGORY_VALUES)
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

    isActive: z.boolean()
        .optional()
}).partial();

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
