// Property Detail View - Displays detailed property information
"use client"
import React, { useEffect, useState } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { usePropertyViewModel } from '@/features/properties/viewmodel/propertyViewModel'
import PropertyImageSlideshow from '@/features/properties/components/PropertyImageSlideshow'
import PropertySaveButton from '@/features/savedProperties/components/PropertySaveButton'
import EnquiryForm from '@/features/enquiry/components/EnquiryForm'
import SenderPropertyEnquiries from '@/features/enquiry/components/SenderPropertyEnquiries'
import { useAuthStore } from '@/shared/stores/authStore'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Send } from 'lucide-react'

export default function PropertyDetailView() {
    const { id } = useParams()
    const { user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const { getPropertyById } = usePropertyViewModel();

    const [data, setData] = useState({});
    const [showFullDec, setShowFullDec] = useState(false);
    const [showEnquiryForm, setShowEnquiryForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getPropertyById(id);
            if (response.success) {
                setData(response.property);
            }
            else {
                console.error(response.message);
                toast.error(response.message);
            }
        }
        fetchData();
    }, [id]);

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

    if (!data || !data.title) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-2 py-4 sm:px-4 bg-gray-50 min-h-screen">
            <PropertySchemaMarkup data={data} />

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

                    <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
                        <PropertySaveButton propertyId={id} property={data} className="mb-2" />
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
                    <div className="bg-white rounded-lg shadow-sm px-2 py-4 sm:px-4 space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">Property Author</h3>

                        <button
                            className="flex items-center gap-4 w-full text-left hover:bg-gray-100 rounded-lg p-2 transition-colors"
                            onClick={() => toast.info("Author profile feature coming soon!")}
                        >
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                <img
                                    src={data.author?.avatar || '/logos/default-profile.png'}
                                    alt={data.author?.name || 'Author Avatar'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-gray-800 font-medium">{data.author?.name || 'N/A'}</p>
                                <p className="text-gray-600 text-sm">📞 {data.author?.phone || 'N/A'}</p>
                                <p className="text-gray-600 text-sm">✉️ {data.author?.email || 'N/A'}</p>
                            </div>
                        </button>
                    </div>

                    {/* Send Enquiry Section */}
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
                </div>
            </div>

            {/* Show user's sent enquiries for this property */}
            {user && <SenderPropertyEnquiries propertyId={id} />}
        </div>
    );
}

const PropertySchemaMarkup = ({ data }) => {
    const baseUrl = process.env.NEXT_APP_SITE_URL;

    return (
        <script type="application/ld+json">
            {JSON.stringify({
                "@context": "https://schema.org",
                "@type": data.property_subtype || "Property",
                "name": data.title,
                "description": data.description,
                "url": `${baseUrl}/properties/${data.id}`,
                "image": data.images?.filter(Boolean) || [],
                "address": {
                    "@type": "PostalAddress",
                    "addressRegion": data.location || "",
                    "addressCountry": "IN"
                },
                "category": data.category || "Real Estate",
                // "numberOfRooms": data.bedrooms || undefined,
                "floorSize": data.area
                    ? {
                        "@type": "QuantitativeValue",
                        "value": data.area.value || data.area,
                        "unitText": "SQFT"
                    }
                    : undefined,
                "offers": {
                    "@type": "Offer",
                    "url": `${baseUrl}/properties/${data.id}`,
                    "priceCurrency": "INR",
                    "price": data.price,
                    "availability": data.isActive
                        ? "https://schema.org/InStock"
                        : "https://schema.org/SoldOut",
                    "itemCondition": "https://schema.org/NewCondition",
                    "category": data.purpose === "rent" ? "Rent" : "Sale"
                },
                "seller": {
                    "@type": "RealEstateAgent",
                    "name": data.author?.name || "Himalayan Nest",
                    "telephone": data.author?.phone || undefined,
                    "email": data.author?.email || undefined
                }
            })}
        </script>
    );
};