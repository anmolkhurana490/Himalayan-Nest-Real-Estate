// Create Property View - Form for adding new property listings
// Re-exported from app/dashboard/create-property/page.js to follow MVVM architecture

"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { usePropertyViewModel } from '@/features/properties/viewmodel/propertyViewModel';
import { createPropertySchema } from '@/features/properties/validation';
import { validateWithSchema } from '@/utils/validator';
import { validateImageFiles } from '@/features/files/validation';
import { useRouter } from 'next/navigation';
import ROUTES from '@/config/constants/routes';
import { PROPERTY_CATEGORIES, PROPERTY_SUBTYPES } from '@/config/constants/property';
import { IMAGES_CONFIG } from '@/config/constants/files';
import { X, Upload, MapPin, Home, IndianRupee, FileText, Tag } from 'lucide-react';

const CreatePropertyView = () => {
    const router = useRouter();
    const { createProperty, error: viewModelError, success: viewModelSuccess, isSubmitting } = usePropertyViewModel();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        category: '',
        property_subtype: '',
        purpose: 'sale',
    });

    const [formImages, setFormImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const categories = Object.values(PROPERTY_CATEGORIES);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        addImages(files);
    };

    const addImages = (files) => {
        // Validate files using the validation module
        const validation = validateImageFiles(files);

        if (!validation.valid) {
            alert(validation.error + (validation.fileName ? ` (${validation.fileName})` : ''));
            return;
        }

        // Limit files based on current images count (max 10)
        const remainingSlots = 10 - formImages.length;
        const filesToAdd = files.slice(0, remainingSlots);

        if (filesToAdd.length < files.length) {
            alert(`Only added ${filesToAdd.length} images. Maximum 10 images allowed.`);
        }

        // Add images to formImages state
        setFormImages(prev => [...prev, ...filesToAdd]);

        // Create previews
        filesToAdd.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        // Remove image from both formImages and previews
        setFormImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formImages.length === 0) {
            alert('At least one image is required');
            return;
        }

        // Validate form data using Zod
        const errors = validateWithSchema(createPropertySchema, formData);
        if (errors.length > 0) {
            alert(errors[0].message);
            return;
        }

        try {
            // Separate images from other form data
            const result = await createProperty(formData, formImages);

            if (result && result.success) {
                alert('Property created successfully');
                router.push(ROUTES.DASHBOARD.PROPERTIES);
            } else {
                alert(result.error || 'Failed to create property');
            }
        } catch (error) {
            console.error('Error creating property:', error);
            alert('An error occurred while creating the property');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Property</h2>
                <p className="text-gray-600 mt-1">Add a new property listing to your portfolio</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 space-y-6">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Property Images * (Max {IMAGES_CONFIG.maxCount} images)
                        </label>

                        {/* Upload Area */}
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors border-gray-300 hover:border-green-500`}
                        >
                            <input
                                type="file"
                                id="image-upload"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={formImages.length >= IMAGES_CONFIG.maxCount}
                            />
                            <label
                                htmlFor="image-upload"
                                className={`cursor-pointer ${formImages.length >= IMAGES_CONFIG.maxCount ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-600 mb-1">
                                    Click to upload
                                </p>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, AVIF, WEBP up to 5MB each
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formImages.length}/{IMAGES_CONFIG.maxCount} images uploaded
                                </p>
                            </label>
                        </div>

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200">
                                        <Image
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            width={200}
                                            height={150}
                                            className="w-full h-32 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        {index === 0 && (
                                            <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                                <Home className="w-4 h-4 mr-2" />
                                Property Title *
                            </div>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Luxury 3BHK Apartment in Green Valley"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                Description *
                            </div>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Provide a detailed description of your property..."
                            rows={5}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            required
                        />
                    </div>

                    {/* Price and Location Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center">
                                    <IndianRupee className="w-4 h-4 mr-2" />
                                    Price *
                                </div>
                            </label>
                            <input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="e.g., 50,00,000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Location *
                                </div>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="e.g., Shimla, Himachal Pradesh"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Purpose */}
                    <div>
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
                    <div>
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
                    {
                        formData.category && PROPERTY_SUBTYPES[formData.category.toUpperCase()] && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Property Type
                                </label>
                                <select
                                    name="property_subtype"
                                    value={formData.property_subtype}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Select Type (Optional)</option>
                                    {PROPERTY_SUBTYPES[formData.category.toUpperCase()].map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )
                    }
                </div >

                {/* Form Actions */}
                < div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-end space-x-3" >
                    <button
                        type="button"
                        onClick={() => router.push(ROUTES.DASHBOARD.PROPERTIES)}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating...
                            </>
                        ) : (
                            'Create Property'
                        )}
                    </button>
                </div >
            </form >
        </div >
    );
};

export default CreatePropertyView;
