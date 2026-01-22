// Property Detail View - Displays detailed property information
"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { usePropertyViewModel } from '@/features/properties/viewmodel/propertyViewModel'
import { RESIDENTIAL_AMENITIES } from '@/config/constants/app'
import Image from 'next/image'

export default function PropertyDetailView() {
    const { id } = useParams()
    const { getPropertyById } = usePropertyViewModel();
    const [data, setData] = useState({})

    const amenities = RESIDENTIAL_AMENITIES

    useEffect(() => {
        const fetchData = async () => {
            const response = await getPropertyById(id);
            if (response.success) {
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
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen">
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
                        <p className="text-3xl md:text-4xl font-bold text-green-600">
                            {formatPrice(data.price)}
                        </p>
                        {data.area && (
                            <p className="text-gray-500 text-sm mt-1">
                                {formatPricePerSqft(data.price, data.area)} per sq.ft
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-4">
                            <Image
                                src={data.image || '/logos/default-property.jpg'}
                                alt={data.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Description</h2>
                        <p className="text-gray-600 leading-relaxed">{data.description}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Property Owner</h3>
                        <div className="space-y-3">
                            <button
                                onClick={handlePhoneClick}
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                📞 Call Now
                            </button>
                            <button
                                onClick={handleMessageClick}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                💬 Send Message
                            </button>
                            <button
                                onClick={handleScheduleVisit}
                                className="w-full border-2 border-green-600 text-green-600 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium"
                            >
                                📅 Schedule Visit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
