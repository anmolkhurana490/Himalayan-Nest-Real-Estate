"use client";
import React, { useState } from 'react'
import EnquiryForm from '../components/EnquiryForm'
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
    const [activeTab, setActiveTab] = useState('contact');

    const [contactData, setContactData] = useState({
        mainOffice: {
            name: "Main Office - Roorkee",
            address: "Himalayan Nest Real Estate\nMain Market, Roorkee\nUttarakhand - 247667, India",
            description: "Primary office serving IIT Roorkee area and surrounding regions",
            phone: ["+91 6398767183", "+91 9837975872"],
            email: ["himalayannestrealestate@gmail.com"],
            hours: "Opening Soon"
        },
        branches: [
            // {
            //     name: "Branch Office - Haridwar",
            //     description: "Serving Haridwar and nearby spiritual destinations"
            // },
            // {
            //     name: "Branch Office - Dehradun",
            //     description: "Capital city office for premium properties"
            // },
            // {
            //     name: "Service Area - Rishikesh",
            //     description: "Yoga capital properties and riverside locations"
            // }
        ]
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Contact Us</h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Get in touch with us for any queries, property listings, or assistance you need.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
                {/* Tabs */}
                <div className="flex justify-center mb-6 sm:mb-8">
                    <div className="bg-white rounded-lg p-1 shadow-sm">
                        <button
                            className={`px-4 sm:px-6 py-2 rounded-md transition-colors text-sm sm:text-base ${activeTab === 'contact'
                                ? 'bg-green-600 text-white'
                                : 'text-gray-600 hover:text-green-600'
                                }`}
                            onClick={() => setActiveTab('contact')}
                        >
                            Contact Information
                        </button>
                        <button
                            className={`px-4 sm:px-6 py-2 rounded-md transition-colors text-sm sm:text-base ${activeTab === 'enquiry'
                                ? 'bg-green-600 text-white'
                                : 'text-gray-600 hover:text-green-600'
                                }`}
                            onClick={() => setActiveTab('enquiry')}
                        >
                            Send Enquiry
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'contact' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                        {/* Contact Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Get in Touch</h2>

                            <div className="space-y-4 sm:space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" strokeWidth={2.25} />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Address</h3>
                                        <p className="text-sm sm:text-base text-gray-600 whitespace-pre-line">
                                            {contactData.mainOffice.address}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" strokeWidth={2.25} />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Phone</h3>
                                        <p className="text-sm sm:text-base text-gray-600">
                                            {contactData.mainOffice.phone.join('\n')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" strokeWidth={2.25} />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Email</h3>
                                        <p className="text-sm sm:text-base text-gray-600">
                                            {contactData.mainOffice.email.join('\n')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" strokeWidth={2.25} />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Office Hours</h3>
                                        <p className="text-sm sm:text-base text-gray-600 whitespace-pre-line">
                                            {contactData.mainOffice.hours}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map or Additional Info */}
                        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Our Locations</h2>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="border-l-4 border-green-500 pl-3 sm:pl-4">
                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{contactData.mainOffice.name}</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm">{contactData.mainOffice.description}</p>
                                </div>
                                {contactData.branches.map((branch, index) => (
                                    <div key={index} className="border-l-4 border-green-500 pl-3 sm:pl-4">
                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{branch.name}</h3>
                                        <p className="text-gray-600 text-xs sm:text-sm">{branch.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-green-50 rounded-lg">
                                <h3 className="font-semibold text-green-800 mb-1 sm:mb-2 text-sm sm:text-base">Quick Response Guarantee</h3>
                                <p className="text-green-700 text-xs sm:text-sm">
                                    We guarantee to respond to all enquiries within 2 hours during business hours.
                                    For urgent matters, please call us directly.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'enquiry' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Send us an Enquiry</h2>
                            <EnquiryForm />
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default Contact
