// Enquiry Validation Schemas using Zod
// Input validation schemas for enquiry endpoints

import { z } from 'zod';
import { ENQUIRY_STATUS, MESSAGE } from '../../../constants/property.js';

const ENQUIRY_STATUS_VALUES = Object.values(ENQUIRY_STATUS);

// Used when creating a new enquiry. Sender and receiver are derived from auth and property.
export const createEnquiryValidation = z.object({
    property_id: z.string({
        required_error: 'Property ID is required',
        invalid_type_error: 'Property ID must be a string',
    }).pipe(
        z.cuid('Invalid property ID format'),
    ),

    message: z.string({
        required_error: 'Message is required',
        invalid_type_error: 'Message must be a string',
    })
        .min(MESSAGE.minLength, `Message must be at least ${MESSAGE.minLength} characters`)
        .max(MESSAGE.maxLength, `Message must be at most ${MESSAGE.maxLength} characters`)
});

// Generic update validation (kept for backward compatibility where needed)
export const updateEnquiryValidation = z.object({
    status: z.enum(ENQUIRY_STATUS_VALUES)
        .optional(),
}).partial();

// Validation for updating enquiry status (receiver only)
export const updateEnquiryStatusValidation = z.object({
    status: z.enum(ENQUIRY_STATUS_VALUES, {
        required_error: 'Status is required',
        invalid_type_error: 'Status must be a valid enquiry status',
    }),
});

// Validation for receiver responding to an enquiry with a message
export const respondEnquiryValidation = z.object({
    message: z.string({
        required_error: 'Message is required',
        invalid_type_error: 'Message must be a string',
    })
        .min(MESSAGE.minLength, `Message must be at least ${MESSAGE.minLength} characters`)
        .max(MESSAGE.maxLength, `Message must be at most ${MESSAGE.maxLength} characters`),
});

