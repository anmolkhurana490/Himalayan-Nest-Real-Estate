// Property Detail View - Displays detailed property information
import usePropertyServerViewModel from '../viewmodel/propertyServerViewModel'
import PropertyImageSlideshow from '@/features/properties/components/PropertyImageSlideshow'
import PropertySaveButton from '@/features/savedProperties/components/PropertySaveButton'
import SenderPropertyEnquiries from '@/features/enquiry/components/SenderPropertyEnquiries'
import { PropertyAuthorContactCard, PropertyDescriptionBox, PropertyEnquirySection } from '../components/PropertyDetailComponents'

export default async function PropertyDetailView({ params }) {
    const { id } = await params;

    const { getPropertyById } = usePropertyServerViewModel();

    const fetchData = async () => {
        const response = await getPropertyById(id);
        if (response.success) {
            return response.property;
        }
        else {
            console.error(response.message);
            // toast.error(response.message);
            return null;
        }
    }

    const data = await fetchData();

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

                    <PropertyDescriptionBox description={data.description} />
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow-sm px-2 py-4 sm:px-4 space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">Property Author</h3>

                        <button
                            className="flex items-center gap-4 w-full text-left hover:bg-gray-100 rounded-lg p-2 transition-colors"
                        // onClick={() => toast.info("Author profile feature coming soon!")}
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
                    <PropertyEnquirySection propertyId={id} />

                    <PropertyAuthorContactCard data={data} />
                </div>
            </div>

            {/* Show user's sent enquiries for this property */}
            <SenderPropertyEnquiries propertyId={id} />
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