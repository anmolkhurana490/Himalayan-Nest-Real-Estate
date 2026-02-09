"use client";
import React from 'react'
import { useEnquiryViewModel } from '@/features/enquiry/viewmodel/enquiryViewModel'
import { createEnquirySchema } from '@/features/enquiry/validation'
import { useForm } from '@/shared/hooks';

const EnquiryForm = ({ propertyId, onSuccess }) => {
    const { submitEnquiry } = useEnquiryViewModel();

    const {
        formData,
        errors,
        isSubmitting,
        message,
        handleChange,
        handleSubmit,
        reset
    } = useForm(
        {
            message: ''
        },
        createEnquirySchema,
        async (data) => {
            const enquiryData = { property_id: propertyId, message: data.message };
            const result = await submitEnquiry(enquiryData);
            if (result?.success) {
                reset();
                if (onSuccess) onSuccess();
            }
            return result;
        }
    );

    return (
        <div>
            {message.content && (
                <div className={`mb-3 sm:mb-4 lg:mb-6 p-3 sm:p-4 rounded-md text-sm sm:text-base ${message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.content}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message *
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        placeholder="I'm interested in this property..."
                    ></textarea>
                    {errors.message && (
                        <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                >
                    {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                </button>
            </form>
        </div>
    );
}

export default EnquiryForm
