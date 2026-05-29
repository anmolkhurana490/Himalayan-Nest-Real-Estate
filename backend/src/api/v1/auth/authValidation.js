// Auth Validation Schemas using Zod
// Input validation schemas for authentication endpoints

import { z } from 'zod';
import { USER_ROLES, AUTH_PROVIDERS } from '../../../constants/user.js';

const ROLE_VALUES = Object.values(USER_ROLES);
const AUTH_PROVIDER_VALUES = Object.values(AUTH_PROVIDERS).filter(provider => provider !== 'credentials'); // Exclude credentials from OAuth providers

export const registerValidation = z.object({
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string'
    })
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be at most 100 characters'),

    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    }).pipe(
        z.email('Invalid email address')
    ),

    phone: z.string()
        .regex(/^[0-9]{10}$/, 'Phone must be 10 digits')
        .optional(),

    password: z.string().min(6, 'Password must be at least 6 characters'),

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
        .min(1, 'Password cannot be empty'),
});

export const updateProfileValidation = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be at most 100 characters')
        .optional(),

    phone: z.string()
        .regex(/^[0-9]{10}$/, 'Phone must be 10 digits')
        .optional(),

    bio: z.string()
        .max(500, 'Bio must be at most 500 characters')
        .optional()
});

export const emailValidation = z.object({
    email: z.string({
        required_error: 'Email is required'
    }).pipe(
        z.email('Invalid email address')
    )
});

export const emailParamValidation = z.object({
    email: z.string().pipe(
        z.email('Invalid email address')
    )
});

export const resolveValidation = z.object({
    provider: z.enum(AUTH_PROVIDER_VALUES, {
        required_error: 'Provider is required',
        invalid_type_error: 'Invalid provider type'
    }),

    id_token: z.string({
        required_error: 'ID token is required'
    }).min(1, 'ID token cannot be empty'),

    userType: z.enum(ROLE_VALUES, {
        required_error: 'User type is required',
        invalid_type_error: 'Invalid user type'
    })
});