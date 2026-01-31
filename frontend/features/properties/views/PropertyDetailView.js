// Property Detail View - Displays detailed property information
"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { usePropertyViewModel } from '@/features/properties/viewmodel/propertyViewModel'
import PropertyImageSlideshow from '@/features/properties/components/PropertyImageSlideshow'

export default function PropertyDetailView() {
    const { id } = useParams()
    const { getPropertyById } = usePropertyViewModel();
    const [data, setData] = useState({})
    const [showFullDec, setShowFullDec] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getPropertyById(id);
            if (response.success) {
                setData(response.property);
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

    if (!data || !data.title) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-2 py-4 sm:px-4 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-sm px-2 py-4 sm:px-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
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

                    <div className="">
                        <p className="text-3xl md:text-4xl font-bold text-green-600">
                            {data.formattedprice}
                        </p>
                        {data.area && (
                            <p className="text-gray-500 text-sm mt-1">
                                {data.formattedpricepersqft} per sq.ft
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    <PropertyImageSlideshow images={data.images} title={data.title} />

                    <div className="bg-white rounded-lg shadow-sm px-2 py-4 sm:px-4">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Description</h2>
                        <p className={`text-gray-600 leading-relaxed ${showFullDec ? '' : 'line-clamp-5'}`}>
                            {data.description}
                        </p>
                        <button
                            onClick={() => setShowFullDec(!showFullDec)}
                            className="mt-2 text-blue-600 hover:underline"
                        >
                            {showFullDec ? 'Show Less' : 'Read More'}
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow-sm px-2 py-4 sm:px-4 sticky top-4">
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
