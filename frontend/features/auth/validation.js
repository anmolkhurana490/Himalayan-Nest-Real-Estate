// Auth Validation Schemas
// Client-side validation using Zod (matching backend validation rules)

import { z } from 'zod';
import { USER_ROLES } from '@/config/constants/user';

// Register validation schema
export const registerSchema = z.object({
    firstName: z.string({
        required_error: 'First name is required',
        invalid_type_error: 'First name must be a string'
    })
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be at most 50 characters')
        .trim(),

    lastName: z.string({
        required_error: 'Last name is required',
        invalid_type_error: 'Last name must be a string'
    })
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be at most 50 characters')
        .trim(),

    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    }).pipe(
        z.email('Invalid email address')
            .toLowerCase()
            .trim(),
    ),

    phone: z.string({
        required_error: 'Phone number is required',
        invalid_type_error: 'Phone must be a string'
    })
        .regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),

    password: z.string().optional(),
    confirmPassword: z.string().optional(),

    userType: z.enum([USER_ROLES.CUSTOMER, USER_ROLES.DEALER], {
        required_error: 'User type is required',
        invalid_type_error: 'Invalid user type'
    }),

    agreeToTerms: z.boolean()
        .refine(val => val === true, {
            message: 'You must agree to the terms and conditions'
        }),

    provider: z.string().optional()
}).superRefine((data, ctx) => {
    // If no OAuth provider, validate password fields
    if (!data.provider) {
        if (!data.password || data.password.length < 6) {
            ctx.addIssue({
                message: 'Password must be at least 6 characters',
                path: ['password'],
            });
        }
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                message: 'Passwords do not match',
                path: ['confirmPassword'],
            });
        }
    }
});

// Login validation schema
export const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required'
    }).pipe(
        z.email('Invalid email address')
            .toLowerCase()
            .trim(),
    ),

    password: z.string({
        required_error: 'Password is required'
    })
        .min(1, 'Password cannot be empty')
});

// Update profile validation schema
export const updateProfileSchema = z.object({
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string'
    })
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be at most 100 characters')
        .trim(),

    phone: z.string({
        required_error: 'Phone is required',
        invalid_type_error: 'Phone must be a string'
    })
        .regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),

    bio: z.string()
        .max(500, 'Bio must be at most 500 characters')
        .optional()
});
