// Property Image Slideshow Component
// Reusable slideshow for property images with auto-play and navigation
"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PropertyImageSlideshow({ images = [], title = "Property" }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto-play slideshow
    useEffect(() => {
        if (!images || images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
            );
        }, 4000); // Change image every 4 seconds

        return () => clearInterval(interval);
    }, [images]);

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const handleDotClick = (index) => {
        setCurrentImageIndex(index);
    };

    // Fallback for empty or invalid images array
    const displayImages = images && images.length > 0 ? images : ['/logos/default-property.jpg'];

    return (
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4">
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden group">
                {/* Main Image */}
                <Image
                    src={displayImages[currentImageIndex] || '/logos/default-property.jpg'}
                    alt={`${title} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover transition-opacity duration-500"
                    priority
                />

                {/* Navigation Arrows - Only show if more than 1 image */}
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            aria-label="Previous image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={handleNextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            aria-label="Next image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {displayImages.length}
                        </div>

                        {/* Dots Navigation */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {displayImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                                        ? 'bg-white w-8'
                                        : 'bg-white/50 hover:bg-white/75'
                                        }`}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnail Strip - Only show if more than 1 image */}
            {displayImages.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto p-2">
                    {displayImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === currentImageIndex
                                ? 'border-blue-600 scale-105'
                                : 'border-gray-300 hover:border-blue-400'
                                }`}
                        >
                            <Image
                                src={img || '/logos/default-property.jpg'}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
