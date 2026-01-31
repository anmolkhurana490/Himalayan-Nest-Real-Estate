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
import './styles.css'
import { Building, House, Info, Mail, Menu, X, ChevronDown } from 'lucide-react'

const Navbar = () => {
    const { logoutUser } = useAuthViewModel();
    const { user } = useAuthStore();
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
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16 gap-2 sm:gap-4">
                    <Link href={ROUTES.HOME} className="flex items-center gap-1 text-2xl font-bold text-green-700">
                        <Image src={'/logos/himalayan-logo.png'} alt="Himalayan Nest Logo" width={40} height={40} className="mr-2 w-auto" />
                        <span className='max-sm:hidden'>Himalayan Nest</span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <div className="hidden lg:flex lg:space-x-6">
                            <Link href={ROUTES.HOME} className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                                Home
                            </Link>
                            <Link href={ROUTES.PROPERTIES} className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                                Properties
                            </Link>
                            <Link href={ROUTES.ABOUT} className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                                About
                            </Link>
                            <Link href={ROUTES.CONTACT} className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                                Contact
                            </Link>

                            <div className="relative group">
                                <button className="text-gray-700 hover:text-green-700 font-medium transition-colors flex items-center">
                                    More <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                                </button>

                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="py-1">
                                        <Link href={ROUTES.PREMIUM} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors">
                                            Premium
                                        </Link>
                                        <Link href={ROUTES.INSIGHTS} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors">
                                            Insights
                                        </Link>
                                        <Link href={ROUTES.CALCULATOR} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors">
                                            Property Price Calculator
                                        </Link>
                                        <Link href={ROUTES.ALERTS} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors">
                                            Alerts
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            {user ? (
                                <>
                                    {/* Avatar with dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                            className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        >
                                            <Image
                                                src={user.image || '/logos/default-profile.png'}
                                                alt={user.name || 'User'}
                                                width={40} height={40}
                                                className="rounded-full border-2 border-gray-500"
                                            />
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </button>

                                        {isProfileDropdownOpen && ProfileDropdown({ user, handleLogout, setIsProfileDropdownOpen })}
                                    </div>

                                    <Link href={ROUTES.DASHBOARD.ROOT} className="max-lg:hidden mx-3 my-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 font-medium text-center transition-colors">
                                        Dashboard
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="max-lg:hidden px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium transition-colors"
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
                    <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={user} handleLogout={handleLogout} />
                </div>
            </div>
        </nav>
    )
}

export const MobileMenu = ({ isMenuOpen, setIsMenuOpen, user, handleLogout }) => {
    const [subMenuOpen, setSubMenuOpen] = useState(false);

    return (
        <div className={`lg:hidden absolute top-16 left-0 right-0 z-50 bg-white border-t shadow-lg overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
            <div className="px-6 py-3 space-y-2">
                <Link href={ROUTES.HOME} onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-700 font-medium">
                    <House className="inline mr-2 h-5 w-5" />
                    Home
                </Link>
                <Link href={ROUTES.PROPERTIES} onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-700 font-medium">
                    <Building className="inline mr-2 h-5 w-5" />
                    Properties
                </Link>
                <Link href={ROUTES.ABOUT} onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-700 font-medium">
                    <Info className="inline mr-2 h-5 w-5" />
                    About
                </Link>
                <Link href={ROUTES.CONTACT} onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-700 font-medium">
                    <Mail className="inline mr-2 h-5 w-5" />
                    Contact
                </Link>

                <div className="border-t pt-2">
                    <button onClick={() => setSubMenuOpen(!subMenuOpen)} className="w-full text-left py-2 text-gray-700 hover:text-green-700 font-medium flex justify-between items-center">
                        More
                        <ChevronDown className={`h-4 w-4 transition-transform ${subMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {subMenuOpen && (
                        <div className="pl-4 space-y-2 mt-2">
                            <Link href={ROUTES.PREMIUM} onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 hover:text-green-700">
                                Premium
                            </Link>
                            <Link href={ROUTES.INSIGHTS} onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 hover:text-green-700">
                                Insights
                            </Link>
                            <Link href={ROUTES.CALCULATOR} onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 hover:text-green-700">
                                Property Price Calculator
                            </Link>
                            <Link href={ROUTES.ALERTS} onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 hover:text-green-700">
                                Alerts
                            </Link>
                        </div>
                    )}
                </div>

                {user ? (
                    <div className="border-t pt-2 space-y-2">
                        {/* <span className="block py-2 text-gray-700 font-medium">
                            Welcome, {user.firstName || user.name || 'User'}
                        </span> */}
                        <Link href={ROUTES.DASHBOARD.ROOT} onClick={() => setIsMenuOpen(false)} className="block py-2 bg-green-700 text-white rounded text-center hover:bg-green-800">
                            Dashboard
                        </Link>
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

const ProfileDropdown = ({ user, handleLogout, setIsProfileDropdownOpen }) => {
    const router = useRouter();

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
                </div>

                <button
                    onClick={() => {
                        setIsProfileDropdownOpen(false);
                        router.push(ROUTES.DASHBOARD.PROFILE);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    Edit Profile
                </button>

                <button
                    onClick={() => {
                        setIsProfileDropdownOpen(false);
                        router.push(ROUTES.DASHBOARD.ROOT);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    Dashboard
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
