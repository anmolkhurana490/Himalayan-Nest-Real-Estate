// Enquiry Validation Schemas
// Client-side validation using Zod (matching backend validation rules)

import { z } from 'zod';

// Create enquiry validation schema
export const createEnquirySchema = z.object({
    message: z.string({
        required_error: 'Message is required',
        invalid_type_error: 'Message must be a string'
    })
        .min(5, 'Message must be at least 5 characters')
        .max(1000, 'Message must be at most 1000 characters')
        .trim(),
});
