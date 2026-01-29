// Subscription Validation Schemas using Zod
// Input validation schemas for subscription endpoints

import { z } from 'zod';
import { SUBSCRIPTION_PLANS } from '../../../constants/user.js';

const SUBSCRIPTION_PLAN_VALUES = Object.values(SUBSCRIPTION_PLANS);

export const createSubscriptionValidation = z.object({
    planType: z.enum(SUBSCRIPTION_PLAN_VALUES, {
        required_error: 'Plan type is required',
        invalid_type_error: 'Invalid plan type'
    }),

    period: z.coerce.number({
        required_error: 'Period is required',
        invalid_type_error: 'Period must be a number'
    })
        .positive('Period must be positive')
        .min(1, 'Period must be at least 1')
});

export const updateSubscriptionValidation = z.object({
    planType: z.enum(SUBSCRIPTION_PLAN_VALUES)
        .optional(),

    endDate: z.coerce.date()
        .optional(),

    isActive: z.boolean()
        .optional()
}).partial();
