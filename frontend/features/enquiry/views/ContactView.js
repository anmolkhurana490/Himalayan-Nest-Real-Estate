// Contact View - Contact page with enquiry form
"use client";
import React, { useState } from 'react'
import EnquiryForm from '@/shared/components/EnquiryForm'
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

export default function ContactView() {
    const [activeTab, setActiveTab] = useState('contact');

    const [contactData] = useState({
        mainOffice: {
            name: "Main Office - Roorkee",
            address: "Himalayan Nest Real Estate\nMain Market, Roorkee\nUttarakhand - 247667, India",
            description: "Primary office serving IIT Roorkee area and surrounding regions",
            phone: ["+91 6398767183", "+91 9837975872"],
            email: ["himalayannestrealestate@gmail.com"],
            hours: "Opening Soon"
        },
        branches: []
    });

    return (
        <div className="min-h-screen bg-gray-50">
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

                {activeTab === 'contact' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
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
                                        {contactData.mainOffice.phone.map((phone, index) => (
                                            <p key={index} className="text-sm sm:text-base text-gray-600">
                                                <a href={`tel:${phone}`} className="hover:text-green-600">
                                                    {phone}
                                                </a>
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" strokeWidth={2.25} />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Email</h3>
                                        {contactData.mainOffice.email.map((email, index) => (
                                            <p key={index} className="text-sm sm:text-base text-gray-600">
                                                <a href={`mailto:${email}`} className="hover:text-green-600">
                                                    {email}
                                                </a>
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" strokeWidth={2.25} />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Business Hours</h3>
                                        <p className="text-sm sm:text-base text-gray-600">
                                            {contactData.mainOffice.hours}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Office Location</h2>
                            <div className="aspect-video bg-gray-200 rounded-lg">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13835.234567890!2d77.89!3d29.86!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDUxJzM2LjAiTiA3N8KwNTMnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    className="rounded-lg"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'enquiry' && (
                    <div className="max-w-3xl mx-auto">
                        <EnquiryForm />
                    </div>
                )}
            </div>
        </div>
    );
}
