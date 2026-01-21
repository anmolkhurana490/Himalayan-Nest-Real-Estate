// Auth Validation Schemas using Zod
// Input validation schemas for authentication endpoints

import { z } from 'zod';
import { ROLE_VALUES } from '../../../constants/roles.js';

export const registerValidation = z.object({
    firstName: z.string({
        required_error: 'First name is required',
        invalid_type_error: 'First name must be a string'
    })
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be at most 50 characters'),

    lastName: z.string({
        required_error: 'Last name is required',
        invalid_type_error: 'Last name must be a string'
    })
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be at most 50 characters'),

    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    }).pipe(
        z.email('Invalid email address')
    ),

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

    userType: z.enum(ROLE_VALUES, {
        required_error: 'User type is required',
        invalid_type_error: 'Invalid user type'
    })
});

export const loginValidation = z.object({
    email: z.string({
        required_error: 'Email is required'
    }).pipe(
        z.email('Invalid email address')
    ),

    password: z.string({
        required_error: 'Password is required'
    })
        .min(1, 'Password cannot be empty')
});

export const updateProfileValidation = z.object({
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string'
    })
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be at most 100 characters'),

    phone: z.string({
        required_error: 'Phone is required',
        invalid_type_error: 'Phone must be a string'
    })
        .regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),

    bio: z.string()
        .max(500, 'Bio must be at most 500 characters')
        .optional()
});
