// Validation Middleware using Zod
// Validates request data against Zod schemas

import { z } from 'zod';
import { HTTP_STATUS } from '../constants/httpStatus.js';

/**
 * Validate request data against a Zod schema
 * @param {z.ZodSchema} schema - Zod validation schema
 * @param {String} source - Where to get data from: 'body', 'query', 'params'
 * @returns {Function} Express middleware function
 */
export const validate = (schema, source = 'body') => {
    return async (req, res, next) => {
        try {
            // Parse and validate the data
            const validated = schema.parse(req[source]);

            // Replace the request data with validated data
            req[source] = validated;

            next();
        } catch (error) {
            // Handle Zod validation errors
            if (error instanceof z.ZodError) {
                if (error.errors === undefined) {
                    error.errors = (msg => {
                        try { return JSON.parse(msg) }
                        catch { return [{ path: [], message: msg }] }
                    })(error.message);
                }

                const errors = error.errors?.map(err => {
                    const path = err.path.join('.');
                    return `${path}: ${err.message}`;
                });

                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'Validation failed',
                    errors
                });
            }

            // Handle other errors
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Validation error',
                error: error.message
            });
        }
    };
};

/**
 * Validate UUID format using Zod
 * @param {String} source - 'params', 'body', 'query'
 * @param {String} field - Field name to validate (default: 'id')
 * @returns {Function} Express middleware function
 */
export const validateUUID = (source = 'params', field = 'id') => {
    const uuidSchema = z.object({
        [field]: z.string().pipe(
            z.uuid({ message: `Invalid ${field} format` })
        )
    });

    return validate(uuidSchema, source);
};

export default validate;
