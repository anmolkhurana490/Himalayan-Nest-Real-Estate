// Property Card Component - Displays individual property information in a card layout
// Reusable component for property listings, search results, and featured properties

import Image from "next/image";
import Link from "next/link";

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
            </div>

            <div className="p-3 sm:p-4 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{property.title}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {property.category}
                    </span>
                </div>

                <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{property.description}</p>

                <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs sm:text-sm">{property.location}</span>
                    <span className="text-base sm:text-lg font-bold text-green-600">₹{property.price}</span>
                </div>

                <Link href={`/properties/${property.id}`} className="w-full text-center mt-2 sm:mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors text-sm sm:text-base">
                    View Details
                </Link>
            </div>
        </div>
    );
}
