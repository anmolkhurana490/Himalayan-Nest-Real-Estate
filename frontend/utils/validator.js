/**
 * Custom validation handler using Zod schemas
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {any} data - Data to validate
 * @returns {Array<{field: string, message: string}>} Array of validation errors (empty if no errors)
 */
export const validateWithSchema = (schema, data) => {
    try {
        // Attempt to parse data with the schema
        schema.parse(data);
        // If successful, return empty array (no errors)
        return [];
    } catch (error) {
        // Check if it's a Zod validation error
        if (!error.errors) {
            try {
                error.errors = JSON.parse(error.message);
            } catch (e) {
                // Unknown error
                error.errors = [{ field: 'unknown', message: 'Validation failed' }];
            }
        }

        // Transform Zod errors into a standardized format
        return error.errors.map((err) => ({
            field: err.path.join('.'), // e.g., "address.street" for nested fields
            message: err.message
        }));
    }
};

/**
 * Validate data and return first error message only
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {any} data - Data to validate
 * @returns {string|null} First error message or null if no errors
 */
export const getFirstError = (schema, data) => {
    const errors = validateWithSchema(schema, data);
    return errors.length > 0 ? errors[0].message : null;
};

/**
 * Validate data and return errors grouped by field
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {any} data - Data to validate
 * @returns {Object<string, string>} Object with field names as keys and error messages as values
 */
export const getFieldErrors = (schema, data) => {
    const errors = validateWithSchema(schema, data);
    return errors.reduce((acc, err) => {
        acc[err.field] = err.message;
        return acc;
    }, {});
};

/**
 * Validate data and return boolean indicating if data is valid
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {any} data - Data to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValid = (schema, data) => {
    return validateWithSchema(schema, data).length === 0;
};
