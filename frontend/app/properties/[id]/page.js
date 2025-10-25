"use client"
import React, { use, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPropertyById } from '@/handlers/PropertyHandlers'
import Image from 'next/image'

const Page = () => {
    const { id } = useParams()
    const [data, setData] = useState({})

    const amenities = [
        "24/7 Security",
        "Swimming Pool",
        "Gymnasium",
        "Children's Play Area",
        "Clubhouse",
    ]

    useEffect(() => {
        const fetchData = async () => {
            const response = await getPropertyById(id);
            if (response.success) {
                // setData({ ...response.data.property, amenities, bedrooms: 3, bathrooms: 2, parking: 1 });
                setData(response.data.property);
            }
            else {
                console.error(response.message);
            }
        }
        fetchData();
    }, [id]);

    const handlePhoneClick = () => {
        if (data.dealer?.phone) {
            window.location.href = `tel:${data.dealer.phone}`;
        }
    };

    const handleMessageClick = () => {
        if (data.dealer?.phone) {
            window.location.href = `sms:${data.dealer.phone}`;
        }
    };

    const handleScheduleVisit = () => {
        alert('Schedule Visit feature coming soon!');
    };

    const handleSaveProperty = () => {
        alert('Property saved to your favorites!');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatPricePerSqft = (price, area) => {
        if (!area) return null;
        const pricePerSqft = price / area;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(pricePerSqft);
    };

    if (!data.title) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                {/* <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div> */}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen">
            {/* Property Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{data.title}</h1>
                        <p className="text-gray-600 flex items-center mb-2">
                            📍 {data.location}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.purpose === 'sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                For {data.purpose}
                            </span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                {data.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {data.isActive ? 'Available' : 'Not Available'}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-blue-600">{formatPrice(data.price)}</p>
                        {data.area && (
                            <p className="text-sm text-gray-500">
                                {formatPricePerSqft(data.price, data.area)} per sq ft
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Images and Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Carousel */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="relative h-64 sm:h-[400px] md:h-[450px] bg-gray-200">
                            {data.images && data.images.length > 0 ? (
                                <ImageCarousal images={data.images} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <p>No images available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Property Features */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Details</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {data.bedrooms && (
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl mb-1">🛏️</div>
                                    <div className="font-semibold">{data.bedrooms}</div>
                                    <div className="text-sm text-gray-500">Bedrooms</div>
                                </div>
                            )}
                            {data.bathrooms && (
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl mb-1">🚿</div>
                                    <div className="font-semibold">{data.bathrooms}</div>
                                    <div className="text-sm text-gray-500">Bathrooms</div>
                                </div>
                            )}
                            {data.area && (
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl mb-1">📐</div>
                                    <div className="font-semibold">{data.area}</div>
                                    <div className="text-sm text-gray-500">Sq Ft</div>
                                </div>
                            )}
                            {data.parking && (
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl mb-1">🚗</div>
                                    <div className="font-semibold">{data.parking}</div>
                                    <div className="text-sm text-gray-500">Parking</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                        <p className="text-gray-600 leading-relaxed">{data.description}</p>
                    </div>

                    {/* Amenities */}
                    {data.amenities && data.amenities.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {data.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center gap-2 text-gray-600">
                                        <span className="text-green-500">✓</span>
                                        <span className="text-sm">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Property Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Property Type</span>
                                <span className="font-medium">{data.category}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Purpose</span>
                                <span className="font-medium capitalize">{data.purpose}</span>
                            </div>
                            {data.furnishing && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Furnishing</span>
                                    <span className="font-medium">{data.furnishing}</span>
                                </div>
                            )}
                            {data.floor && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Floor</span>
                                    <span className="font-medium">{data.floor}</span>
                                </div>
                            )}
                            {data.totalFloors && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Total Floors</span>
                                    <span className="font-medium">{data.totalFloors}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Listed On</span>
                                <span className="font-medium">{new Date(data.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Contact & Actions */}
                <div className="space-y-6">
                    {/* Contact Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">👨‍💼</span>
                            </div>
                            <h3 className="font-semibold text-gray-800">{data.dealer?.name || 'Property Dealer'}</h3>
                            <p className="text-sm text-gray-500">Verified Agent</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <button
                                onClick={handlePhoneClick}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                📞 Call Now
                            </button>
                            <button
                                onClick={handleMessageClick}
                                className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                            >
                                💬 Send Message
                            </button>
                            <button
                                onClick={handleScheduleVisit}
                                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                📅 Schedule Visit
                            </button>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleSaveProperty}
                                className="text-red-500 hover:text-red-600 transition-colors flex items-center justify-center gap-2 mx-auto"
                            >
                                ❤️ Save Property
                            </button>
                        </div>
                    </div>

                    {/* EMI Calculator */}
                    {data.purpose === 'sale' && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">EMI Calculator</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-gray-600">Loan Amount</label>
                                    <div className="text-lg font-semibold">{formatPrice(data.price * 0.8)}</div>
                                    <div className="text-xs text-gray-500">80% of property value</div>
                                </div>
                                <div className="text-center py-3 bg-blue-50 rounded-lg">
                                    <div className="text-sm text-gray-600">Estimated EMI</div>
                                    <div className="text-xl font-bold text-blue-600">
                                        {formatPrice(Math.round((data.price * 0.8 * 0.009) / (1 - Math.pow(1 + 0.009, -240))))}
                                    </div>
                                    <div className="text-xs text-gray-500">for 20 years @ 10.8% p.a.</div>
                                </div>
                                <button className="w-full text-blue-600 border border-blue-600 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                                    Detailed Calculator
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Similar Properties */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Similar Properties</h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    <img src={'/logos/default-property.jpg'} className="w-16 h-12 bg-gray-200 rounded flex-shrink-0" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-800">Similar Property {item}</div>
                                        <div className="text-xs text-gray-500">2 BHK • {data.location}</div>
                                        <div className="text-sm font-semibold text-blue-600">₹ 45.5L</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ImageCarousal = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const nextImage = () => {
        if (images && images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (images && images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextImage();
        }
        if (isRightSwipe) {
            prevImage();
        }
    };

    useEffect(() => {
        const interval = setInterval(nextImage, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative h-full">
            <Image
                src={images[currentImageIndex]}
                alt={`Property Image ${currentImageIndex + 1}`}
                width={300}
                height={250}
                onError={(e) => e.target.src = '/logos/default-property.jpg'}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full h-full object-cover touch-none select-none"
                draggable={false}
            />

            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
            </div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                        ←
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                        →
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default Page
