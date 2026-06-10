// Footer Component - Site footer with copyright and legal links
// Displays at the bottom of all pages with company information and policy links

import Link from "next/link";
import ROUTES from "@/config/constants/routes";

const Footer = () => {
    return (
        <footer className="bg-green-900 shadow-md mt-auto">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
                <div className="flex max-sm:flex-col justify-between items-center gap-2 text-xs sm:text-sm lg:text-base">
                    <span className="text-gray-100">© 2023 Himalayan Nest. All rights reserved.</span>

                    <div className="flex flex-wrap space-x-4">
                        <Link href={ROUTES.ABOUT} target="_blank" className="text-gray-100 hover:text-green-300">About Us</Link>
                        <Link href={ROUTES.CONTACT} target="_blank" className="text-gray-100 hover:text-green-300">Contact Us</Link>

                        <Link href="/privacy" target="_blank" className="text-gray-100 hover:text-green-300">Privacy Policy</Link>
                        <Link href="/terms" target="_blank" className="text-gray-100 hover:text-green-300">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;