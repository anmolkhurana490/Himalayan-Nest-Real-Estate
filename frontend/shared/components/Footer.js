// Footer Component - Site footer with copyright and legal links
// Displays at the bottom of all pages with company information and policy links

import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-green-900 shadow-md mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <span className="text-gray-100">© 2023 Himalayan Nest. All rights reserved.</span>
                    <div className="flex space-x-4">
                        <a href="/privacy" target="_blank" className="text-gray-100 hover:text-green-300">Privacy Policy</a>
                        <a href="/terms" target="_blank" className="text-gray-100 hover:text-green-300">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
