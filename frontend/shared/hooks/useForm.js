// useForm Hook - Reusable form state management
// Eliminates duplicate form handling logic across components

import { useState } from 'react';
import { ZodError } from 'zod';

/**
 * Custom hook for form state management with validation
 * 
 * @param {Object} initialValues - Initial form field values
 * @param {Object} validationSchema - Zod validation schema (optional)
 * @param {Function} onSubmit - Form submission handler
 * 
 * @returns {Object} Form state and handlers
 * 
 * @example
 * const { formData, errors, handleChange, handleSubmit, reset } = useForm(
 *   { email: '', password: '' },
 *   loginSchema,
 *   async (data) => { await login(data); }
 * );
 */
export const useForm = (initialValues = {}, validationSchema = null, onSubmit = null) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    /**
     * Handle input change
     */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    /**
     * Handle multiple field updates at once
     */
    const updateFields = (updates) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    /**
     * Validate form data using Zod schema
     */
    const validate = () => {
        if (!validationSchema) return true;

        try {
            validationSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            const fieldErrors = {};

            if (error instanceof ZodError) {
                JSON.parse(error.message).forEach(err => {
                    fieldErrors[err.path[0]] = err.message;
                });
            } else {
                fieldErrors.general = error.message || 'Validation failed';
            }

            setErrors(fieldErrors);
            return false;
        }
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Validate if schema provided
        if (validationSchema && !validate()) {
            setMessage({ type: 'error', content: 'Please fix the errors in the form' });
            return;
        }

        if (!onSubmit) return;

        try {
            setIsSubmitting(true);
            setMessage({ type: '', content: '' });

            const result = await onSubmit(formData);

            if (result?.success) {
                setMessage({ type: 'success', content: result.message || 'Success!' });
                return result;
            } else {
                setMessage({ type: 'error', content: result?.message || 'Operation failed' });
                return result;
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'An error occurred';
            setMessage({ type: 'error', content: errorMsg });
            return { success: false, error: errorMsg };
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Reset form to initial values
     */
    const reset = () => {
        setFormData(initialValues);
        setErrors({});
        setMessage({ type: '', content: '' });
        setIsSubmitting(false);
    };

    /**
     * Reset only errors and messages
     */
    const clearMessages = () => {
        setErrors({});
        setMessage({ type: '', content: '' });
    };

    return {
        formData,
        errors,
        isSubmitting,
        message,
        handleChange,
        handleSubmit,
        updateFields,
        validate,
        reset,
        clearMessages,
        setFormData,
        setErrors,
        setMessage,
    };
};

export default useForm;
