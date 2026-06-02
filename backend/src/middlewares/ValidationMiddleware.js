// Validation Middleware using Zod
// Validates request data against Zod schemas

import { file, z } from 'zod';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { BadRequestError, InternalServerError } from '../utils/errorUtils.js';

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
            if (source === 'query') req['validatedQuery'] = validated;
            else req[source] = validated;

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

                const message = `Validation failed: ${errors.join(', ')}`;
                return next(new BadRequestError(message));
            }

            // Handle other errors
            return next(new InternalServerError('Validation error: ' + error.message));
        }
    };
};

/**
 * Validate CUID format using Zod
 * @param {String} field - Field name to validate (default: 'id')
 * @param {String} source - 'params', 'body', 'query'
 * @returns {Function} Express middleware function
 */
export const validateCUID = (field = 'id', source = 'params') => {
    const cuidSchema = z.object({
        [field]: z.string().pipe(
            z.cuid({ message: `Invalid ${field} format` })
        )
    });

    return validate(cuidSchema, source);
};

export default validate;
