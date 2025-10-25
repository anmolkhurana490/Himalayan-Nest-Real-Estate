import { Building, Check, Search, ShipWheel } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">About Himalayan Nest</h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Your trusted partner in finding the perfect property in the beautiful state of Uttarakhand and surrounding regions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Our Mission</h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                            At Himalayan Nest, we are committed to making property searching and transactions seamless,
                            transparent, and reliable. Whether you&apos;re looking to buy, rent, or list your property,
                            we provide a platform that connects buyers, sellers, and renters effectively.
                        </p>
                        <p className="text-sm sm:text-base text-gray-600">
                            We specialize in properties across Uttarakhand including Roorkee, Haridwar, Dehradun,
                            Rishikesh, and other beautiful cities in the region.
                        </p>
                    </div>
                    <div className="bg-green-50 p-6 sm:p-8 rounded-lg">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-green-700 mb-3 sm:mb-4">Why Choose Us?</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li className="flex items-center">
                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3" strokeWidth={2.5} />
                                <span className="text-sm sm:text-base">Verified listings and trusted dealers</span>
                            </li>
                            <li className="flex items-center">
                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3" strokeWidth={2.5} />
                                <span className="text-sm sm:text-base">Local expertise in Uttarakhand region</span>
                            </li>
                            <li className="flex items-center">
                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3" strokeWidth={2.5} />
                                <span className="text-sm sm:text-base">Wide range of property categories</span>
                            </li>
                            <li className="flex items-center">
                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3" strokeWidth={2.5} />
                                <span className="text-sm sm:text-base">Easy location-based search</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="bg-white py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        <div className="text-center p-4 sm:p-6">
                            <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" strokeWidth={2.25} />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Property Search</h3>
                            <p className="text-sm sm:text-base text-gray-600">Find your perfect property with our advanced search filters and location-based results.</p>
                        </div>

                        <div className="text-center p-4 sm:p-6">
                            <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Building className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" strokeWidth={2.25} />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Property Listing</h3>
                            <p className="text-sm sm:text-base text-gray-600">List your property and reach thousands of potential buyers and renters in the region.</p>
                        </div>

                        <div className="text-center p-4 sm:p-6">
                            <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <ShipWheel className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" strokeWidth={2.25} />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Expert Support</h3>
                            <p className="text-sm sm:text-base text-gray-600">Get professional guidance and support throughout your property journey.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-green-600 py-12 sm:py-16">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">Ready to Find Your Dream Property?</h2>
                    <p className="text-green-100 mb-6 sm:mb-8 text-base sm:text-lg">
                        Join thousands of satisfied customers who found their perfect home with Himalayan Nest.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <Link href="/properties" className="bg-white text-green-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base">
                            Browse Properties
                        </Link>
                        <Link href="/contact" className="bg-green-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors text-sm sm:text-base">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
