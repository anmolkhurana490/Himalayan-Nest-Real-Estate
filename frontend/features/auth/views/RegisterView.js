// Register View
"use client";
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/authStore'
import { useAuthViewModel } from '../viewmodel/authViewModel'
import { USER_ROLES } from '@/config/constants/user'
import ROUTES from '@/config/constants/routes'
import { LoaderCircle } from 'lucide-react';
import { registerSchema } from '../validation'
import { validateWithSchema } from '@/utils/validator';
import Image from 'next/image';

export default function RegisterView() {
    const searchParams = useSearchParams();
    const oauthSignup = searchParams.get('oauthSignup') === 'true';

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        provider: 'credentials',
        confirmPassword: '',
        userType: USER_ROLES.CUSTOMER,
        agreeToTerms: false,
    });

    useEffect(() => {
        if (oauthSignup) {
            setFormData(prev => ({
                firstName: searchParams.get('name')?.split(' ')[0] || '',
                lastName: searchParams.get('name')?.split(' ').slice(1).join(' ') || '',
                email: searchParams.get('email') || '',
                phone: '',
                password: '',
                confirmPassword: '',
                userType: USER_ROLES.CUSTOMER,
                agreeToTerms: false,
                provider: searchParams.get('provider'),
                providerAccountId: searchParams.get('providerAccountId') || '',
            }));
        }
    }, []);

    const { registerUser, oauthSignIn, error: viewModelError, isSubmitting, setSubmitting } = useAuthViewModel();
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [error, setError] = useState(searchParams.get('error'));
    const [success, setSuccess] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle', 'registering', 'signing-in', 'success'
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        if (error) setError('');
        if (success) setSuccess('');

        if (name === 'password') {
            validatePassword(value);
        }
    };

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) errors.push("At least 8 characters long");
        if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
        if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
        if (!/\d/.test(password)) errors.push("At least one number");
        if (!/[!@#$%^&*]/.test(password)) errors.push("At least one special character");
        setPasswordErrors(errors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate form data using Zod
        const errors = validateWithSchema(registerSchema, formData);
        if (errors.length > 0) {
            setError(errors[0].message);
            return;
        }

        try {
            setStatus('registering');
            setSubmitting(true);

            const registrationData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                userType: formData.userType,
                provider: formData.provider,
                providerAccountId: formData.providerAccountId,
            };

            const result = await registerUser(registrationData);

            if (!result.success) {
                setStatus('idle');
                setError(result.message || 'Registration failed. Please try again.');
                return;
            }

            // If OAuth signup, automatically sign in with provider
            if (oauthSignup) {
                setStatus('signing-in');
                const signInResult = await oauthSignIn('google', false); // 'false' indicates sign-in flow

                if (signInResult.success) {
                    setStatus('success');
                    setSuccess('Registration successful! Redirecting to dashboard...');
                    setTimeout(() => {
                        router.push(ROUTES.DASHBOARD.ROOT);
                    }, 1500);
                } else {
                    setStatus('idle');
                    setError('Registration successful but auto-login failed. Please login manually.');
                    setTimeout(() => {
                        router.push(ROUTES.LOGIN);
                    }, 2000);
                }
            } else {
                // For regular signup, show success and redirect to login
                setStatus('success');
                setSuccess('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push(ROUTES.LOGIN);
                }, 2000);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setStatus('idle');
            setError(error.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex sm:items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="text-center">
                        <Link href="/" className="text-2xl sm:text-3xl font-bold text-green-700">
                            Himalayan Nest
                        </Link>
                    </div>
                    <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-xs sm:text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href={ROUTES.LOGIN} className="font-medium text-green-600 hover:text-green-500">
                            Sign in here
                        </Link>
                    </p>
                </div>

                <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 shadow rounded-lg">
                    {oauthSignup && !error && (
                        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-md text-sm">
                            Email not found. Please sign up first to continue.
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                            {success}
                        </div>
                    )}

                    <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700">
                                    First Name *
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 text-xs sm:text-sm"
                                    placeholder="First name"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700">
                                    Last Name *
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 text-xs sm:text-sm"
                                    placeholder="Last name"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                                Email Address *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                disabled={oauthSignup}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm disabled:bg-gray-100"
                                placeholder="Enter your email address"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700">
                                Phone Number *
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div>
                            <label htmlFor="userType" className="block text-xs sm:text-sm font-medium text-gray-700">
                                I am a *
                            </label>
                            <select
                                id="userType"
                                name="userType"
                                value={formData.userType}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                            >
                                <option value={USER_ROLES.CUSTOMER}>Property Buyer/Seller</option>
                                <option value={USER_ROLES.DEALER}>Real Estate Dealer/Agent</option>
                            </select>
                        </div>

                        {!oauthSignup && <div>
                            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                                Password *
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Create a strong password"
                            />
                            {formData.password && (
                                <div className="mt-2 text-xs">
                                    <p className="text-gray-600 mb-1">Password must have:</p>
                                    <ul className="space-y-1">
                                        {[
                                            { check: formData.password.length >= 8, text: "At least 8 characters" },
                                            { check: /[A-Z]/.test(formData.password), text: "One uppercase letter" },
                                            { check: /[a-z]/.test(formData.password), text: "One lowercase letter" },
                                            { check: /\d/.test(formData.password), text: "One number" },
                                            { check: /[!@#$%^&*]/.test(formData.password), text: "One special character" }
                                        ].map((req, index) => (
                                            <li key={index} className={`flex items-center ${req.check ? 'text-green-600' : 'text-red-600'}`}>
                                                <span className="mr-2">{req.check ? '✓' : '✗'}</span>
                                                {req.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>}

                        {!oauthSignup && <div>
                            <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700">
                                Confirm Password *
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm your password"
                            />
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                            )}
                        </div>}

                        <div className="flex items-center">
                            <input
                                id="agreeToTerms"
                                name="agreeToTerms"
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                required
                            />
                            <label htmlFor="agreeToTerms" className="ml-2 block text-xs sm:text-sm text-gray-900">
                                I agree to the{' '}
                                <a href="#" className="text-green-600 hover:text-green-500">
                                    Terms of Service
                                </a>
                                {' '}and{' '}
                                <a href="#" className="text-green-600 hover:text-green-500">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={status !== 'idle'}
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white ${status !== 'idle' || passwordErrors.length > 0 || !formData.agreeToTerms
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                    }`}
                            >
                                {status === 'registering' && (
                                    <span className="flex items-center">
                                        <LoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Creating account...
                                    </span>
                                )}
                                {status === 'signing-in' && (
                                    <span className="flex items-center">
                                        <LoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Signing you in...
                                    </span>
                                )}
                                {status === 'success' && (
                                    <span className="flex items-center">
                                        <svg className="-ml-1 mr-3 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Success!
                                    </span>
                                )}
                                {status === 'idle' && 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <button
                        type="button"
                        onClick={() => oauthSignIn('google', true)} // 'true' indicate sign-up flow
                        disabled={status !== 'idle'}
                        className="mt-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Image
                            src="/logos/google-oauth.svg"
                            alt="Google Logo"
                            width={20} height={20}
                            className="mr-2"
                        />
                        Sign Up with Google
                    </button>

                    <div className="mt-6">
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 text-center">
                            Already have an Account?{' '}
                        </p>

                        <Link href={ROUTES.LOGIN} className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            Login to your account
                        </Link>
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-xs sm:text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue as</span>
                            </div>
                        </div>

                        <Link
                            href={ROUTES.PROPERTIES}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Guest User
                        </Link>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        By creating an account, you get access to:{' '}
                    </p>
                    <ul className="mt-2 text-sm text-gray-500 space-y-1">
                        <li>• Save favorite properties</li>
                        <li>• Get personalized recommendations</li>
                        <li>• List and manage your properties</li>
                        <li>• Direct contact with property owners</li>
                    </ul>
                </div>
            </div>
        </div >
    )
}