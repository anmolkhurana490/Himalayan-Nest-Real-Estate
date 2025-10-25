// Property Card Component - Displays individual property information in a card layout
// Reusable component for property listings, search results, and featured properties

import Image from "next/image";
import Link from "next/link";

export default function PropertyCard({ property }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Property Image with fallback */}
            <div className="relative h-40 sm:h-48">
                <Image
                    src={property.image || '/logos/default-property.jpg'}
                    alt={property.title}
                    onError={(e) => e.target.src = '/logos/default-property.jpg'} // Fallback on error
                    fill sizes='(100vw) 100vw, (min-width: 400px) 50vw, (min-width: 724px) 33vw'
                    className="object-cover"
                />
            </div>

            {/* Property Information */}
            <div className="p-3 sm:p-4 flex flex-col">
                {/* Title and Category */}
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{property.title}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {property.category}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-xs sm:text-sm mb-2">{property.description}</p>

                {/* Location and Price */}
                <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs sm:text-sm">{property.location}</span>
                    <span className="text-base sm:text-lg font-bold text-green-600">₹{property.price}</span>
                </div>

                {/* View Details Button */}
                <Link href={`/properties/${property.id}`} className="w-full text-center mt-2 sm:mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors text-sm sm:text-base">
                    View Details
                </Link>
            </div>
        </div>
    );
}


// export default function PropertyCard({ id, title, price, location, image }) {
//     return (
//         <div className="border rounded-lg overflow-hidden shadow-lg">
//             <Image src={image} alt={title} className="w-full h-48 object-cover" unoptimized />
//             <div className="p-4">
//                 <h2 className="font-bold text-xl">{title}</h2>
//                 <p className="text-gray-600">{location}</p>
//                 <p className="text-blue-600 font-semibold">₹ {price.toLocaleString()}</p>
//                 <a href={`/properties/${id}`} className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded">
//                     View Details
//                 </a>
//             </div>
//         </div>
//     );
// }
