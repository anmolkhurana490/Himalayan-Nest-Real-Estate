/**
 * 404 Not Found Page
 */

'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import ROUTES from '@/config/constants/routes';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-green-600 mb-4">404</h1>
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <Home className="w-24 h-24 text-gray-300" />
                            <Search className="w-12 h-12 text-green-600 absolute -bottom-2 -right-2" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Oops! Page Not Found
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
                    {`The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track!`}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href={ROUTES.HOME}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md w-full sm:w-auto justify-center"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>

                    <Link
                        href={ROUTES.PROPERTIES}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium w-full sm:w-auto justify-center"
                    >
                        <Search className="w-5 h-5" />
                        Browse Properties
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium w-full sm:w-auto justify-center"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>

                {/* Helpful Links */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">You might be looking for:</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link href={ROUTES.ABOUT} className="text-green-600 hover:text-green-700 hover:underline">
                            About Us
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link href={ROUTES.CONTACT} className="text-green-600 hover:text-green-700 hover:underline">
                            Contact
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link href={ROUTES.LOGIN} className="text-green-600 hover:text-green-700 hover:underline">
                            Login
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link href={ROUTES.REGISTER} className="text-green-600 hover:text-green-700 hover:underline">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
