"use client";
import React, { useState, useEffect } from 'react';
import { usePropertyViewModel } from '@/features/properties/viewmodel/propertyViewModel';
import { updatePropertySchema } from '@/features/properties/validation';
import { validateWithSchema } from '@/utils/validator';
import { validateImageFiles } from '@/features/files/validation';
import { PROPERTY_CATEGORIES, PROPERTY_SUBTYPES } from '@/config/constants/property';
import { IMAGES_CONFIG } from '@/config/constants/files';
import { Plus, X, Tag, Upload } from 'lucide-react';

const EditProperty = ({ property, onClose, onUpdate }) => {
    const { updateProperty, error: viewModelError, success: viewModelSuccess, isSubmitting } = usePropertyViewModel();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        property_subtype: '',
        purpose: '',
        location: '',
        price: ''
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [totalImagesCount, setTotalImagesCount] = useState(0);

    const categories = Object.values(PROPERTY_CATEGORIES);

    useEffect(() => {
        if (property) {
            setFormData({
                title: property.title || '',
                description: property.description || '',
                category: property.category || '',
                property_subtype: property.property_subtype || '',
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

    useEffect(() => {
        // Update total images count
        const count = selectedFiles.length + existingImages.length - imagesToDelete.length;
        setTotalImagesCount(count);
    }, [selectedFiles, existingImages, imagesToDelete]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        let files = Array.from(e.target.files);

        // Validate files
        const validation = validateImageFiles(files);
        if (!validation.valid) {
            setMessage({
                type: 'error',
                content: validation.error
            });
            return;
        }

        const maxFiles = IMAGES_CONFIG.maxCount - totalImagesCount;

        if (maxFiles < files.length) {
            setMessage({
                type: 'error',
                content: `Maximum ${IMAGES_CONFIG.maxCount} images allowed in total`
            });
            files = files.slice(0, maxFiles);
        }

        setSelectedFiles(prev => [...prev, ...files]);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...previews]);
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
        if (totalImagesCount == IMAGES_CONFIG.maxCount) {
            setMessage({
                type: 'error',
                content: `Cannot restore image. Maximum ${IMAGES_CONFIG.maxCount} images allowed in total`
            });
            return;
        }
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
        }
    };

    if (!property) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-100 sm:p-4">
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

                            {/* Purpose */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Purpose *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, purpose: 'sale' }))}
                                        className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${formData.purpose === 'sale'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        For Sale
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, purpose: 'rent' }))}
                                        className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${formData.purpose === 'rent'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        For Rent
                                    </button>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center">
                                        <Tag className="w-4 h-4 mr-2" />
                                        Category *
                                    </div>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, category, property_subtype: '' }))}
                                            className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${formData.category === category
                                                ? 'border-green-500 bg-green-50 text-green-700'
                                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Property Subtype - Show based on category */}
                            {formData.category && PROPERTY_SUBTYPES[formData.category.toUpperCase()] && (
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Property Type
                                    </label>
                                    <select
                                        name="property_subtype"
                                        value={formData.property_subtype}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="">Select Type (Optional)</option>
                                        {PROPERTY_SUBTYPES[formData.category.toUpperCase()].map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

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
                                    id="image-upload"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={totalImagesCount >= IMAGES_CONFIG.maxCount}
                                />
                                <label
                                    htmlFor="image-upload"
                                    className={`cursor-pointer ${totalImagesCount >= IMAGES_CONFIG.maxCount ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {/* <span className="text-gray-600">Click to add more images</span> */}
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-sm text-gray-600 mb-1">
                                        Click to upload
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, AVIF, WEBP up to 5MB each
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {totalImagesCount}/{IMAGES_CONFIG.maxCount} images uploaded
                                    </p>
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
