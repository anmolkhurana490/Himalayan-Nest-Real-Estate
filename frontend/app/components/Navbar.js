// Navigation Bar Component - Main site navigation with authentication
// Provides responsive navigation, user authentication UI, and mobile menu

"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppContext } from '../context/AppContext'
import { logoutUser } from '../../handlers/AuthHandlers'
import Image from 'next/image'
import './styles.css'
import { Building, House, Info, Mail, Menu, X, ChevronDown } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu toggle
  const { user, setUser, setLoading } = useAppContext(); // Global user state
  const router = useRouter();

  // Toggle mobile menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle user logout process
  const handleLogout = async () => {
    try {
      setLoading(true);
      const result = await logoutUser(); // Call logout API

      if (result && result.success) {
        // Successful logout - clear user state and redirect
        setUser(null);
        router.push('/');
      } else {
        console.error('Logout failed:', result?.error || result?.message);
        // Clear user data locally even if server logout fails (fail-safe)
        setUser(null);
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Clear user data locally on any error
      setUser(null);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-1">
            <Image src={'/logos/himalayan-logo.png'} alt="Himalayan Nest Logo" width={40} height={40} className="mr-2 w-auto" />
            <Link href="/" className="text-2xl font-bold text-green-700">
              Himalayan Nest
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
              Home
            </Link>
            <Link href="/properties" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
              Properties
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
              Contact
            </Link>

            {/* More Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-green-700 font-medium transition-colors flex items-center">
                More <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link href="/premium" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors">
                    Premium
                  </Link>
                  <Link href="/insights" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors">
                    Insights
                  </Link>
                  <Link href="/calculator" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors">
                    Property Price Calculator
                  </Link>
                  <Link href="/alerts" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors">
                    Alerts
                  </Link>
                </div>
              </div>
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  Welcome, {user.firstName || user.name || 'User'}
                </span>

                <Link href="/dashboard" className="block mx-3 my-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 font-medium text-center transition-colors">
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 font-medium transition-colors">
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
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

          {/* Mobile Navigation Menu */}
          <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={user} handleLogout={handleLogout} />
        </div>
      </div>
    </nav>
  )
}

export const MobileMenu = ({ isMenuOpen, setIsMenuOpen, user, handleLogout }) => {
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <div className={`sm:hidden overflow-y-auto absolute top-16 left-0 right-0 bg-white shadow-lg border-t z-50 overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="flex flex-col px-2 pt-2 pb-3 space-y-1">
        <Link
          href="/"
          className="block px-3 py-2 text-gray-700 hover:text-green-700 hover:bg-gray-50 font-medium transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          href="/properties"
          className="block px-3 py-2 text-gray-700 hover:text-green-700 hover:bg-gray-50 font-medium transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          Properties
        </Link>
        <Link
          href="/about"
          className="block px-3 py-2 text-gray-700 hover:text-green-700 hover:bg-gray-50 font-medium transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          About
        </Link>
        <Link
          href="/contact"
          className="block px-3 py-2 text-gray-700 hover:text-green-700 hover:bg-gray-50 font-medium transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          Contact
        </Link>

        {/* Mobile More Section */}
        <div>
          <button
            onClick={() => setSubMenuOpen(prev => !prev)}
            className="w-full text-left px-3 py-2 text-gray-700 hover:text-green-700 hover:bg-gray-50 font-medium transition-colors flex items-center justify-between"
          >
            See {subMenuOpen ? 'Less' : 'More'}
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${subMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <div className={"pl-6 space-y-1 " + (subMenuOpen ? 'block' : 'hidden')}>
            <Link
              href="/premium"
              className="block px-3 py-2 text-gray-600 hover:text-green-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Premium
            </Link>
            <Link
              href="/insights"
              className="block px-3 py-2 text-gray-600 hover:text-green-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Insights
            </Link>
            <Link
              href="/calculator"
              className="block px-3 py-2 text-gray-600 hover:text-green-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Property Price Calculator
            </Link>
            <Link
              href="/alerts"
              className="block px-3 py-2 text-gray-600 hover:text-green-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Alerts
            </Link>
          </div>
        </div>

        {user ? (
          <>
            <div className="px-3 py-2 text-gray-700 font-medium border-t">
              Welcome, {user.firstName || user.name || 'User'}
            </div>

            <Link href="/dashboard" className="block mx-3 my-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 font-medium text-center transition-colors">
              Dashboard
            </Link>

            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="block mx-3 my-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium text-center transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="block mx-3 my-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 font-medium text-center transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Get Started
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar
