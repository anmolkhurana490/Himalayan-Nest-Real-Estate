// Property Detail Page Interactive components

"use client"
import React, { useState } from 'react'
import EnquiryForm from '@/features/enquiry/components/EnquiryForm';
import { Send } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const PropertyDescriptionBox = ({ description }) => {
    const [showFullDec, setShowFullDec] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-sm px-2 py-4 sm:px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Description</h2>
            <p className={`text-gray-600 leading-relaxed ${showFullDec ? '' : 'line-clamp-5'}`}>
                {description}
            </p>
            <button
                onClick={() => setShowFullDec(!showFullDec)}
                className="mt-2 text-blue-600 hover:underline"
            >
                {showFullDec ? 'Show Less' : 'Read More'}
            </button>
        </div>
    )
}

export const PropertyEnquirySection = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [showEnquiryForm, setShowEnquiryForm] = useState(false);

    const toggleEnquiryFormHandler = () => {
        if (showEnquiryForm) {
            setShowEnquiryForm(false);
        }
        else if (!user) {
            toast.error('You must be logged in to send an enquiry');
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        }
        else {
            setShowEnquiryForm(true);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm px-2 py-4 sm:px-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Send Enquiry</h3>
                {showEnquiryForm && (
                    <button
                        onClick={toggleEnquiryFormHandler}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Cancel
                    </button>
                )}
            </div>

            {!showEnquiryForm ? (
                <button
                    onClick={toggleEnquiryFormHandler}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <Send className="w-5 h-5" />
                    Send Enquiry
                </button>
            ) : (
                <EnquiryForm
                    propertyId={id}
                    onSuccess={() => {
                        setShowEnquiryForm(false);
                        toast.success('Enquiry sent successfully!');
                    }}
                />
            )}
        </div>
    )
}

export const PropertyAuthorContactCard = () => {
    const handlePhoneClick = () => {
        if (data.author?.phone) {
            toast.info("Call feature coming soon!");
            // window.location.href = `tel:${data.author.phone}`;
        }
    };

    const handleMessageClick = () => {
        if (data.author?.phone) {
            toast.info("Message feature coming soon!");
            // window.location.href = `sms:${data.author.phone}`;
        }
    };

    const handleScheduleVisit = () => {
        toast.info('Schedule Visit feature coming soon!');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm px-2 py-4 sm:px-4 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Property Author</h3>
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
    )
}
