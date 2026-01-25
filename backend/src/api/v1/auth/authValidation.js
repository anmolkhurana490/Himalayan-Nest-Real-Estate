// Auth Validation Schemas using Zod
// Input validation schemas for authentication endpoints

import { z } from 'zod';
import { AUTH_PROVIDER_VALUES, ROLE_VALUES } from '../../../constants/auth.js';

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

    password: z.string().optional(),

    provider: z.enum(AUTH_PROVIDER_VALUES, {
        required_error: 'Provider is required',
        invalid_type_error: 'Invalid provider type'
    }),

    providerAccountId: z.string().optional(),

    userType: z.enum(ROLE_VALUES, {
        required_error: 'User type is required',
        invalid_type_error: 'Invalid user type'
    })
}).superRefine((data, ctx) => {
    // Validate based on provider type
    if (data.provider === 'credentials') {
        // For credentials, password is required
        if (!data.password || data.password.length < 6) {
            ctx.addIssue({
                message: 'Password must be at least 6 characters',
                path: ['password'],
            });
        }
    }
    else {
        // For OAuth providers, providerAccountId is required
        if (!data.providerAccountId) {
            ctx.addIssue({
                message: 'Provider account ID is required for OAuth providers',
                path: ['providerAccountId'],
            });
        }
    }
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

    provider: z.enum(AUTH_PROVIDER_VALUES).optional().default('credentials')
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
    email: z.string({
        required_error: 'Email is required'
    }).pipe(
        z.email('Invalid email address')
    ),

    provider: z.enum(AUTH_PROVIDER_VALUES, {
        required_error: 'Provider is required',
        invalid_type_error: 'Invalid provider type'
    }),

    providerAccountId: z.string().optional(),

    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    userType: z.enum(ROLE_VALUES).optional()

}).superRefine((data, ctx) => {
    // Validate based on provider type
    if (data.provider === 'credentials') {
        ctx.addIssue({
            message: 'Credentials provider is not supported for OAuth resolution',
            path: ['provider'],
        });
    } else if (!data.providerAccountId) {
        // For OAuth providers, providerAccountId is required
        ctx.addIssue({
            message: 'Provider account ID is required for OAuth providers',
            path: ['providerAccountId'],
        });
    }
});