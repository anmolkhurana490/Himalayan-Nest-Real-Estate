// Enquiry Validation Schemas using Zod
// Input validation schemas for enquiry endpoints

import { z } from 'zod';
import { ENQUIRY_STATUS_VALUES } from '../../../constants/property.js';

export const createEnquiryValidation = z.object({
    property_id: z.string({
        required_error: 'Property ID is required',
        invalid_type_error: 'Property ID must be a string'
    }).pipe(
        z.uuid('Invalid property ID format'),
    ),

    user_id: z.string({
        required_error: 'User ID is required',
        invalid_type_error: 'User ID must be a string'
    }).pipe(
        z.uuid('Invalid property ID format'),
    ),

    message: z.string()
        .max(1000, 'Message must be at most 1000 characters')
        .optional(),

    status: z.enum(ENQUIRY_STATUS_VALUES)
        .optional()
        .default('pending')
});

export const updateEnquiryValidation = z.object({
    message: z.string()
        .max(1000, 'Message must be at most 1000 characters')
        .optional(),

    status: z.enum(ENQUIRY_STATUS_VALUES)
        .optional()
}).partial();
