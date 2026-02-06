// Property Card Component - Displays individual property information in a card layout
// Reusable component for property listings, search results, and featured properties

import Image from "next/image";
import Link from "next/link";
import PropertySaveButton from "@/features/savedProperties/components/PropertySaveButton";
import ROUTES from "@/config/constants/routes";

export default function PropertyCard({ property }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-40 sm:h-48">
                <Image
                    src={property.image || '/logos/default-property.jpg'}
                    alt={property.title}
                    onError={(e) => e.target.src = '/logos/default-property.jpg'}
                    fill sizes='(100vw) 100vw, (min-width: 400px) 50vw, (min-width: 724px) 33vw'
                    className="object-cover"
                />
                <PropertySaveButton
                    propertyId={property.id}
                    property={property}
                    className="absolute top-2 right-2 shadow-lg"
                />
            </div>

            <div className="p-2 sm:p-4 flex flex-col">
                <div className="flex justify-between items-start mb-2 gap-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">{property.title}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded line-clamp-2 min-w-max">
                        {property.category}
                    </span>
                </div>

                <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{property.description}</p>

                <div className="flex justify-between items-center gap-1">
                    <span className="text-gray-500 text-xs sm:text-sm line-clamp-2">{property.location}</span>
                    <span className="text-base sm:text-lg font-bold text-green-600">{property.formattedprice}</span>
                </div>

                <Link href={ROUTES.PROPERTIES.DETAIL(property.id)} className="w-full text-center mt-2 sm:mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors text-sm sm:text-base">
                    View Details
                </Link>
            </div>
        </div>
    );
}
