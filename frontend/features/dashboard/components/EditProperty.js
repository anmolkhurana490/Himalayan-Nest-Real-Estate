"use client";
import React, { useState, useEffect } from 'react';
import { updateProperty } from '@/features/properties/viewmodel/propertyViewModel';
import { updatePropertySchema } from '@/features/properties/validation';
import { validateWithSchema } from '@/utils/validator';
import { PROPERTY_SUBTYPES, VALIDATION_LIMITS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/constants/app';
import { Plus, X } from 'lucide-react';

const EditProperty = ({ property, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        purpose: '',
        location: '',
        price: ''
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    // Combine all property subtypes for category dropdown
    const categories = [
        ...PROPERTY_SUBTYPES.RESIDENTIAL.map(type => ({ value: type.toLowerCase(), label: type })),
        ...PROPERTY_SUBTYPES.LAND.map(type => ({ value: type.toLowerCase(), label: type })),
        ...PROPERTY_SUBTYPES.COMMERCIAL.map(type => ({ value: type.toLowerCase(), label: type })),
        ...PROPERTY_SUBTYPES.INDUSTRIAL.map(type => ({ value: type.toLowerCase(), label: type })),
    ];

    useEffect(() => {
        if (property) {
            setFormData({
                title: property.title || '',
                description: property.description || '',
                category: property.category || '',
                purpose: property.purpose || '',
                location: property.location || '',
                price: property.price || ''
            });

            // Set existing images
            if (property.images && Array.isArray(property.images)) {
                setExistingImages(property.images);
            }
        }
    }, [property]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + existingImages.length - imagesToDelete.length > VALIDATION_LIMITS.IMAGE_MAX_COUNT) {
            setMessage({
                type: 'error',
                content: `Maximum ${VALIDATION_LIMITS.IMAGE_MAX_COUNT} images allowed in total`
            });
            return;
        }

        setSelectedFiles(files);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const removeNewImage = (index) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newPreviews = previewImages.filter((_, i) => i !== index);

        // Clean up object URL
        URL.revokeObjectURL(previewImages[index]);

        setSelectedFiles(newFiles);
        setPreviewImages(newPreviews);
    };

    const removeExistingImage = (imageUrl) => {
        setImagesToDelete(prev => [...prev, imageUrl]);
    };

    const restoreExistingImage = (imageUrl) => {
        setImagesToDelete(prev => prev.filter(url => url !== imageUrl));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', content: '' });

        // Validate form data using Zod
        const errors = validateWithSchema(updatePropertySchema, formData);
        if (errors.length > 0) {
            setMessage({
                type: 'error',
                content: errors[0].message
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const result = await updateProperty(
                property.id,
                formData,
                selectedFiles,
                imagesToDelete
            );

            if (result && result.success) {
                // setMessage({
                //     type: 'success',
                //     content: 'Property updated successfully!'
                // });

                // Call parent update function
                if (onUpdate && result.data?.property) {
                    onUpdate(result.data.property);
                }

                onClose();

            } else {
                setMessage({
                    type: 'error',
                    content: result?.error || result?.message || 'Failed to update property'
                });
            }
        } catch (error) {
            console.error('Error updating property:', error);
            setMessage({
                type: 'error',
                content: 'An unexpected error occurred'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!property) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[100vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="p-6 pb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Edit Property</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {message.content && (
                        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.content}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="lg:col-span-2">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Property Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                                    Purpose *
                                </label>
                                <select
                                    id="purpose"
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Select Purpose</option>
                                    <option value="rent">For Rent</option>
                                    <option value="sale">For Sale</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            ></textarea>
                        </div>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Images
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {existingImages.map((imageUrl, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={imageUrl}
                                                alt={`Property ${index + 1}`}
                                                className={`w-full h-24 object-cover rounded-lg border ${imagesToDelete.includes(imageUrl)
                                                    ? 'border-red-300 opacity-50'
                                                    : 'border-gray-200'
                                                    }`}
                                            />
                                            {imagesToDelete.includes(imageUrl) ? (
                                                <button
                                                    type="button"
                                                    onClick={() => restoreExistingImage(imageUrl)}
                                                    className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1 text-xs"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(imageUrl)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Image Upload */}
                        <div>
                            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                                Add New Images
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                                <input
                                    type="file"
                                    id="images"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label htmlFor="images" className="cursor-pointer">
                                    <span className="text-gray-600">Click to add more images</span>
                                </label>
                            </div>

                            {/* New Image Previews */}
                            {previewImages.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {previewImages.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`New ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Property'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProperty;
