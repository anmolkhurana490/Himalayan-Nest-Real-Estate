// Enquiry Validation Schemas
// Client-side validation using Zod (matching backend validation rules)

import { z } from 'zod';

// Create enquiry validation schema
export const createEnquirySchema = z.object({
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string'
    })
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be at most 100 characters')
        .trim(),

    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    })
        .email('Invalid email address')
        .toLowerCase()
        .trim(),

    phone: z.string({
        required_error: 'Phone number is required',
        invalid_type_error: 'Phone must be a string'
    })
        .regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),

    message: z.string({
        required_error: 'Message is required',
        invalid_type_error: 'Message must be a string'
    })
        .min(10, 'Message must be at least 10 characters')
        .max(1000, 'Message must be at most 1000 characters')
        .trim(),

    propertyType: z.string()
        .optional(),

    budget: z.string()
        .optional()
});
