// Navbar Component - Main site navigation with authentication
// Provides responsive navigation, user authentication UI, and mobile menu

"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthViewModel } from '@/features/auth/viewmodel/authViewModel'
import { useAuthStore } from '@/shared/stores/authStore'
import { useAppStore } from '@/shared/stores/appStore'
import Image from 'next/image'
import ROUTES from '@/config/constants/routes'
import ModeToggle from './ModeToggle'
import './styles.css'
import { Building, House, Info, Mail, Menu, X, ChevronDown, BookmarkPlus, PlusCircle, MessageSquare, Home } from 'lucide-react'

// Main navigation links
const mainNavLinks = [
    { key: 'nav-home', href: ROUTES.HOME, label: 'Home', icon: House },
    { key: 'nav-properties', href: ROUTES.PROPERTIES.ROOT, label: 'Properties', icon: Building },
];

// Additional navigation links
const secondaryNavLinks = [

];

// Customer mode-specific links
const getBuyerLinks = () => [
    { key: 'buyer-saved', href: ROUTES.ACCOUNT.SAVED, label: 'Saved', mobileLabel: 'Saved Properties', icon: BookmarkPlus },
];

const getSellerLinks = () => [
    { key: 'seller-listings', href: ROUTES.ACCOUNT.PROPERTIES, label: 'My Listings', icon: Building },
    { key: 'seller-add', href: ROUTES.ACCOUNT.ADD_PROPERTY, label: 'Add Property', icon: PlusCircle },
];

// More dropdown links
const moreDropdownLinks = [
    { key: 'more-premium', href: ROUTES.PREMIUM, label: 'Premium' },
    { key: 'more-insights', href: ROUTES.INSIGHTS, label: 'Insights' },
    { key: 'more-calculator', href: ROUTES.CALCULATOR, label: 'Property Price Calculator' },
    { key: 'more-alerts', href: ROUTES.ALERTS, label: 'Alerts' },
    { key: 'more-about', href: ROUTES.ABOUT, label: 'About', icon: Info },
    { key: 'more-contact', href: ROUTES.CONTACT, label: 'Contact', icon: Mail },
];

const Navbar = () => {
    const { logoutUser } = useAuthViewModel();
    const { user, viewMode } = useAuthStore();
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        await logoutUser();
        router.push(ROUTES.REDIRECTS.AFTER_LOGOUT);
    };

    return (
        <nav className="bg-white shadow-md relative">
            <div className="mx-auto px-2 sm:px-4 lg:px-6">
                <div className="flex justify-between items-center h-14 sm:h-16 gap-2 sm:gap-4">
                    <Link href={ROUTES.HOME} className="flex items-center gap-1 text-2xl font-bold text-green-700">
                        <Image src={'/logos/himalayan-logo.png'} alt="Himalayan Nest Logo" width={40} height={40} className="mr-2 w-auto" />
                        <span className='max-sm:hidden'>Himalayan Nest</span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <div className="hidden lg:flex lg:items-center lg:space-x-6">
                            {/* Main navigation links */}
                            {mainNavLinks.map((link) => (
                                <Link
                                    key={link.key}
                                    href={link.href}
                                    className="text-gray-700 hover:text-green-700 font-medium transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Customer mode-specific links */}
                            {user?.role === 'customer' && viewMode === 'buyer' && getBuyerLinks().map((link) => (
                                <Link
                                    key={link.key}
                                    href={link.href}
                                    className="text-gray-700 hover:text-green-700 font-medium transition-colors flex items-center gap-1"
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            ))}

                            {user?.role === 'customer' && viewMode === 'seller' && getSellerLinks().map((link) => (
                                <Link
                                    key={link.key}
                                    href={link.href}
                                    className="text-gray-700 hover:text-green-700 font-medium transition-colors flex items-center gap-1"
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            ))}

                            {/* Secondary navigation links */}
                            {secondaryNavLinks.map((link) => (
                                <Link
                                    key={link.key}
                                    href={link.href}
                                    className="text-gray-700 hover:text-green-700 font-medium transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* More dropdown */}
                            <div className="relative group">
                                <button className="text-gray-700 hover:text-green-700 font-medium transition-colors flex items-center">
                                    More <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                                </button>

                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="py-1">
                                        {moreDropdownLinks.map((link) => (
                                            <Link
                                                key={link.key}
                                                href={link.href}
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 sm:space-x-6">
                            {/* Mode Toggle for customers */}
                            {user && user.role === 'customer' && (
                                <div className="hidden sm:block">
                                    <ModeToggle />
                                </div>
                            )}

                            {user ? (
                                <>
                                    {/* Avatar with dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                            className="flex items-center space-x-2 sm:space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        >
                                            <Image
                                                src={user.image || '/logos/default-profile.png'}
                                                alt={user.name || 'User'}
                                                width={40} height={40}
                                                className="rounded-full border-2 border-gray-500"
                                            />
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </button>

                                        {isProfileDropdownOpen && ProfileDropdown({ user, viewMode, handleLogout, setIsProfileDropdownOpen, router })}
                                    </div>

                                    {/* Dashboard/Account link based on role */}
                                    {user.role === 'dealer' || user.role === 'admin' ? (
                                        <Link href={ROUTES.DASHBOARD.ROOT} className="max-lg:hidden px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 font-medium text-center transition-colors">
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <Link href={ROUTES.ACCOUNT.DASHBOARD} className="max-lg:hidden px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 font-medium text-center transition-colors">
                                            My Account
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="max-lg:hidden px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium transition-colors max-xl:hidden"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link href={ROUTES.LOGIN} className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 font-medium transition-colors">
                                    Get Started
                                </Link>
                            )}

                            <div className="lg:hidden">
                                <button
                                    onClick={toggleMenu}
                                    className={"text-gray-700 transition-transform hover:text-green-700 focus:outline-none focus:text-green-700 " + (isMenuOpen ? ' rotate-90' : '')}
                                    aria-label="Toggle menu"
                                >
                                    {isMenuOpen ? (
                                        <X className="h-6 w-6" />
                                    ) : (
                                        <Menu className="h-6 w-6" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {isMenuOpen && <div className="lg:hidden fixed w-screen h-screen inset-0 bg-black opacity-25 z-40" onClick={toggleMenu} />}
                    <MobileMenu
                        isMenuOpen={isMenuOpen}
                        setIsMenuOpen={setIsMenuOpen}
                        user={user}
                        viewMode={viewMode}
                        handleLogout={handleLogout}
                    />
                </div>
            </div>
        </nav>
    )
}

export const MobileMenu = ({
    isMenuOpen,
    setIsMenuOpen,
    user,
    viewMode,
    handleLogout
}) => {
    const [subMenuOpen, setSubMenuOpen] = useState(false);

    return (
        <div className={`lg:hidden absolute top-16 left-0 right-0 z-50 bg-white shadow-lg overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen border-t' : 'max-h-0'}`}>
            <div className="px-6 py-3 space-y-2">
                {/* Mode Toggle for mobile */}
                {user?.role === 'customer' && (
                    <div className="pb-2 border-b">
                        <ModeToggle />
                    </div>
                )}

                {/* Main navigation links */}
                {mainNavLinks.map((link) => (
                    <Link
                        key={link.key}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 text-gray-700 hover:text-green-700 font-medium"
                    >
                        <link.icon className="inline mr-2 h-5 w-5" />
                        {link.label}
                    </Link>
                ))}

                {/* Customer mode-specific links */}
                {user?.role === 'customer' && viewMode === 'buyer' && getBuyerLinks().map((link) => (
                    <Link
                        key={link.key}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 text-gray-700 hover:text-green-700 font-medium"
                    >
                        <link.icon className="inline mr-2 h-5 w-5" />
                        {link.mobileLabel || link.label}
                    </Link>
                ))}

                {user?.role === 'customer' && viewMode === 'seller' && getSellerLinks().map((link) => (
                    <Link
                        key={link.key}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 text-gray-700 hover:text-green-700 font-medium"
                    >
                        <link.icon className="inline mr-2 h-5 w-5" />
                        {link.label}
                    </Link>
                ))}

                {/* Secondary navigation links */}
                {secondaryNavLinks.map((link) => (
                    <Link
                        key={link.key}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 text-gray-700 hover:text-green-700 font-medium"
                    >
                        <link.icon className="inline mr-2 h-5 w-5" />
                        {link.label}
                    </Link>
                ))}

                {/* More submenu */}
                <div className="border-t pt-2">
                    <button onClick={() => setSubMenuOpen(!subMenuOpen)} className="w-full text-left py-2 text-gray-700 hover:text-green-700 font-medium flex justify-between items-center">
                        More
                        <ChevronDown className={`h-4 w-4 transition-transform ${subMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {subMenuOpen && (
                        <div className="pl-4 space-y-2 mt-2">
                            {moreDropdownLinks.map((link) => (
                                <Link
                                    key={link.key}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-2 text-gray-600 hover:text-green-700"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {user ? (
                    <div className="border-t pt-2 space-y-2">
                        {user.role === 'dealer' || user.role === 'admin' ? (
                            <Link href={ROUTES.DASHBOARD.ROOT} onClick={() => setIsMenuOpen(false)} className="block py-2 bg-green-700 text-white rounded text-center hover:bg-green-800">
                                Dashboard
                            </Link>
                        ) : (
                            <Link href={ROUTES.ACCOUNT.DASHBOARD} onClick={() => setIsMenuOpen(false)} className="block py-2 bg-green-700 text-white rounded text-center hover:bg-green-800">
                                My Account
                            </Link>
                        )}
                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="border-t pt-2">
                        <Link href={ROUTES.LOGIN} onClick={() => setIsMenuOpen(false)} className="block py-2 bg-green-700 text-white rounded text-center hover:bg-green-800">
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProfileDropdown = ({ user, viewMode, handleLogout, setIsProfileDropdownOpen, router }) => {

    return (
        <>
            <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user?.name || `${user?.firstName} ${user?.lastName}` || 'User'}</div>
                    <div className="text-gray-500 truncate">{user?.email}</div>
                    {user?.role === 'customer' && viewMode && (
                        <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${viewMode === 'buyer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                }`}>
                                {viewMode === 'buyer' ? 'Buyer Mode' : 'Seller Mode'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Mode-specific quick actions */}
                {user?.role === 'customer' && viewMode === 'buyer' && (
                    <button
                        onClick={() => {
                            setIsProfileDropdownOpen(false);
                            router.push(ROUTES.ACCOUNT.SAVED);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <BookmarkPlus className="w-4 h-4 inline-block mr-2" />
                        Saved Properties
                    </button>
                )}

                {user?.role === 'customer' && viewMode === 'seller' && (
                    <>
                        <button
                            onClick={() => {
                                setIsProfileDropdownOpen(false);
                                router.push(ROUTES.ACCOUNT.PROPERTIES);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <Home className="w-4 h-4 inline-block mr-2" />
                            My Listings
                        </button>
                        <button
                            onClick={() => {
                                setIsProfileDropdownOpen(false);
                                router.push(ROUTES.ACCOUNT.ADD_PROPERTY);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <PlusCircle className="w-4 h-4 inline-block mr-2" />
                            Add Property
                        </button>
                    </>
                )}

                {/* Common actions */}
                <button
                    onClick={() => {
                        setIsProfileDropdownOpen(false);
                        router.push(user?.role === 'customer' ? ROUTES.ACCOUNT.SETTINGS : ROUTES.DASHBOARD.PROFILE);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    {user?.role === 'customer' ? 'Settings' : 'Edit Profile'}
                </button>

                <button
                    onClick={() => {
                        setIsProfileDropdownOpen(false);
                        router.push(user?.role === 'customer' ? ROUTES.ACCOUNT.DASHBOARD : ROUTES.DASHBOARD.ROOT);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    {user?.role === 'customer' ? 'My Account' : 'Dashboard'}
                </button>

                <button
                    onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                >
                    Sign Out
                </button>
            </div>
        </>
    );
};

export default Navbar
