// Create Property View - Form for adding new property listings
// Re-exported from app/dashboard/create-property/page.js to follow MVVM architecture

"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import { usePropertyViewModel } from '@/features/properties/viewmodel/propertyViewModel';
import { createPropertySchema } from '@/features/properties/validation';
import { useRouter, usePathname } from 'next/navigation';
import ROUTES from '@/config/constants/routes';
import { PROPERTY_CATEGORIES, PROPERTY_SUBTYPES } from '@/config/constants/property';
import { IMAGES_CONFIG } from '@/config/constants/files';
import { X, Upload, MapPin, Home, IndianRupee, FileText, Tag } from 'lucide-react';
import { useForm, useImageUpload } from '@/shared/hooks';

const CreatePropertyView = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { createProperty } = usePropertyViewModel();
    const categories = Object.values(PROPERTY_CATEGORIES);

    // Detect if we're in account or dashboard context
    const isAccountContext = pathname?.startsWith('/account');
    const propertiesListRoute = isAccountContext ? ROUTES.ACCOUNT.PROPERTIES : ROUTES.DASHBOARD.PROPERTIES;

    const {
        formData,
        errors,
        isSubmitting,
        message,
        handleChange,
        handleSubmit,
        updateFields
    } = useForm(
        {
            title: '',
            description: '',
            price: '',
            location: '',
            category: '',
            property_subtype: '',
            purpose: 'sale',
        },
        createPropertySchema,
        async (data) => {
            if (images.length === 0) {
                return { success: false, message: 'At least one image is required' };
            }
            const result = await createProperty(data, images);
            if (result?.success) {
                router.push(propertiesListRoute);
            }
            return result;
        }
    );

    const {
        images,
        previews: imagePreviews,
        errors: imageErrors,
        handleImageSelect,
        removeImage,
        imageCount,
        canAddMore
    } = useImageUpload();

    return (
        <div className="max-w-4xl mx-auto p-1 sm:p-4 lg:p-6">
            <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Property</h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Add a new property listing to your portfolio</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {message.content && message.type === 'error' && (
                    <div className="mx-2 sm:mx-4 lg:mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                        {message.content}
                    </div>
                )}
                {message.content && message.type === 'success' && (
                    <div className="mx-2 sm:mx-4 lg:mx-6 mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                        {message.content}
                    </div>
                )}
                <div className="px-2 py-4 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Property Images * (Max {IMAGES_CONFIG.maxCount} images)
                        </label>

                        {/* Upload Area */}
                        <div
                            className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors border-gray-300 hover:border-green-500`}
                        >
                            <input
                                type="file"
                                id="image-upload"
                                multiple
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                                disabled={!canAddMore}
                            />
                            <label
                                htmlFor="image-upload"
                                className={`cursor-pointer ${!canAddMore ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-600 mb-1">
                                    Click to upload
                                </p>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, AVIF, WEBP up to 5MB each
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {imageCount}/{IMAGES_CONFIG.maxCount} images uploaded
                                </p>
                            </label>
                        </div>

                        {/* Image Errors */}
                        {imageErrors.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {imageErrors.map((error, index) => (
                                    <p key={index} className="text-xs text-red-600">{error}</p>
                                ))}
                            </div>
                        )}

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
                            onChange={handleChange}
                            placeholder="e.g., Luxury 3BHK Apartment in Green Valley"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                        )}
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
                            onChange={handleChange}
                            placeholder="Provide a detailed description of your property..."
                            rows={5}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            required
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                        )}
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
                                onChange={handleChange}
                                placeholder="e.g., 50,00,000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                            {errors.price && (
                                <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                            )}
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
                                onChange={handleChange}
                                placeholder="e.g., Shimla, Himachal Pradesh"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                            {errors.location && (
                                <p className="mt-1 text-xs text-red-600">{errors.location}</p>
                            )}
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
                                onClick={() => updateFields({ purpose: 'sale' })}
                                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${formData.purpose === 'sale'
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                For Sale
                            </button>
                            <button
                                type="button"
                                onClick={() => updateFields({ purpose: 'rent' })}
                                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${formData.purpose === 'rent'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                For Rent
                            </button>
                        </div>
                        {errors.purpose && (
                            <p className="mt-1 text-xs text-red-600">{errors.purpose}</p>
                        )}
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
                                    onClick={() => updateFields({ category, property_subtype: '' })}
                                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${formData.category === category
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        {errors.category && (
                            <p className="mt-1 text-xs text-red-600">{errors.category}</p>
                        )}
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
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Select Type (Optional)</option>
                                    {PROPERTY_SUBTYPES[formData.category.toUpperCase()].map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {errors.property_subtype && (
                                    <p className="mt-1 text-xs text-red-600">{errors.property_subtype}</p>
                                )}
                            </div>
                        )
                    }
                </div >

                {/* Form Actions */}
                < div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-end space-x-3" >
                    <button
                        type="button"
                        onClick={() => router.push(propertiesListRoute)}
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
