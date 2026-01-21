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
    })
        .email('Invalid email address')
        .toLowerCase()
        .trim(),

    phone: z.string({
        required_error: 'Phone number is required',
        invalid_type_error: 'Phone must be a string'
    })
        .regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),

    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string'
    })
        .min(6, 'Password must be at least 6 characters'),

    confirmPassword: z.string({
        required_error: 'Please confirm your password'
    }),

    userType: z.enum([USER_ROLES.CUSTOMER, USER_ROLES.DEALER], {
        required_error: 'User type is required',
        invalid_type_error: 'Invalid user type'
    }),

    agreeToTerms: z.boolean()
        .refine(val => val === true, {
            message: 'You must agree to the terms and conditions'
        })
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

// Login validation schema
export const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required'
    })
        .email('Invalid email address')
        .toLowerCase()
        .trim(),

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
