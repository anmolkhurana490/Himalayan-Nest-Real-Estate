/**
 * Customer Validation Schemas
 * Zod schemas for customer preferences and settings
 */

import { z } from 'zod';

/**
 * User preferences validation schema
 */
export const preferencesSchema = z.object({
    emailNotifications: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
    priceAlerts: z.boolean().optional(),
    newListingsAlert: z.boolean().optional(),
    savedSearches: z.array(z.object({
        name: z.string(),
        filters: z.record(z.any()),
    })).optional(),
    preferredLocations: z.array(z.string()).optional(),
    priceRange: z.object({
        min: z.number().min(0).optional(),
        max: z.number().min(0).optional(),
    }).optional(),
    propertyTypes: z.array(z.string()).optional(),
});

/**
 * Property comparison request schema
 */
export const comparisonSchema = z.object({
    propertyIds: z.array(z.string()).min(2).max(4, 'Can compare up to 4 properties'),
});

/**
 * Saved search schema
 */
export const savedSearchSchema = z.object({
    name: z.string().min(1, 'Search name is required').max(100),
    filters: z.record(z.any()),
    alertEnabled: z.boolean().optional(),
});

/**
 * Validate user preferences
 */
export const validatePreferences = (data) => {
    try {
        return {
            success: true,
            data: preferencesSchema.parse(data),
        };
    } catch (error) {
        return {
            success: false,
            errors: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            })),
        };
    }
};

/**
 * Validate property comparison request
 */
export const validateComparison = (data) => {
    try {
        return {
            success: true,
            data: comparisonSchema.parse(data),
        };
    } catch (error) {
        return {
            success: false,
            errors: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            })),
        };
    }
};

/**
 * Validate saved search
 */
export const validateSavedSearch = (data) => {
    try {
        return {
            success: true,
            data: savedSearchSchema.parse(data),
        };
    } catch (error) {
        return {
            success: false,
            errors: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            })),
        };
    }
};

export default {
    preferencesSchema,
    comparisonSchema,
    savedSearchSchema,
    validatePreferences,
    validateComparison,
    validateSavedSearch,
};
