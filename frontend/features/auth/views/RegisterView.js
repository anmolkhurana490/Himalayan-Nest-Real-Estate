// Register View
"use client";
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthViewModel } from '../viewmodel/authViewModel'
import { USER_ROLES } from '@/config/constants/user'
import ROUTES from '@/config/constants/routes'
import { LoaderCircle } from 'lucide-react';
import { registerSchema } from '../validation'
import Image from 'next/image';
import { useForm } from '@/shared/hooks';

const OAuthProviders = ['google']; // Extend this array as you add more providers

export default function RegisterView() {
    const searchParams = useSearchParams();
    const oauthSignup = searchParams.get('oauth'); // specifies provider name for OAuth signups (e.g., 'google')
    const [oauthFieldsRequired, setOauthFieldsRequired] = useState({});

    const router = useRouter();
    const { registerUser, loginUser, oauthSignIn } = useAuthViewModel();
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [status, setStatus] = useState('idle'); // 'idle', 'registering', 'signing-in', 'success'

    // Define initial form values
    const initialValues = {
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        userType: USER_ROLES.CUSTOMER,
        agreeToTerms: false,
    };

    // Define submit handler
    const handleFormSubmit = async (data) => {
        try {
            setStatus('registering');

            // Register the user (with signupToken if it's an OAuth signup flow)
            const registrationData = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
                userType: data.userType,
            };

            const signupToken = oauthSignup ? searchParams.get('signupToken') : null;

            const result = await registerUser(registrationData, oauthSignup, signupToken);

            if (!result.success) {
                setStatus('idle');
                return result;
            }

            // Registration successful, now log the user in
            setStatus('signing-in');

            if (oauthSignup) {
                await oauthSignIn(oauthSignup, ROUTES.REGISTER);
            }
            else {
                await loginUser({
                    email: registrationData.email,
                    password: registrationData.password,
                });
            }

            // For regular signup, show success and redirect to login
            setStatus('success');
            setTimeout(() => {
                router.push(ROUTES.PROPERTIES.ROOT);
            }, 1000);

            return { success: true, message: 'Account created successfully! Redirecting to login...' };
        } catch (error) {
            console.error('Registration error:', error);
            setStatus('idle');
            return { success: false, message: error.message || 'An unexpected error occurred. Please try again.' };
        }
    };

    const handleOAuthSignIn = async (provider) => {
        setStatus('signing-in');

        await oauthSignIn(provider, ROUTES.REGISTER);
        setTimeout(() => {
            router.push(ROUTES.PROPERTIES.ROOT);
        }, 1000);
    }

    const {
        formData,
        errors,
        isSubmitting,
        message,
        handleChange: baseHandleChange,
        handleSubmit,
        setFormData,
        setMessage
    } = useForm(initialValues, registerSchema, handleFormSubmit);

    // Set initial error from URL params
    useEffect(() => {
        const urlError = searchParams.get('error');
        if (urlError) {
            setMessage({ type: 'error', content: urlError });
        }
    }, [searchParams, setMessage]);

    // Populate form from OAuth params
    useEffect(() => {
        if (!oauthSignup) return;

        if (!OAuthProviders.includes(oauthSignup)) {
            router.replace(ROUTES.REGISTER); // Redirect to regular register if provider is invalid
            return;
        }

        const message = searchParams.get('message');
        if (message) setMessage({ type: 'success', content: message });

        const data = (() => {
            try {
                return JSON.parse(searchParams.get('data') || '{}');
            } catch {
                return {};
            }
        })();

        if (!data || !data.required) {
            router.replace(ROUTES.REGISTER); // Redirect to regular register if no valid data is present
            return;
        }

        console.log('OAuth Signup Data:', data);

        // Pre-fill form with available data from OAuth provider
        setFormData({
            name: data.filled?.name || '',
            email: data.filled?.email || '',
            phone: data.filled?.phone || '',
            userType: data.filled?.userType || USER_ROLES.CUSTOMER,
            agreeToTerms: false,
        });

        // Set which fields are required
        setOauthFieldsRequired(data.required || {});

    }, [oauthSignup, searchParams, setFormData]);

    // Enhanced handleChange with password validation
    const handleChange = (e) => {
        if (e.target.name === "firstName") {
            e.target.name = "name";
            e.target.value = `${e.target.value} ${formData.name.split(' ')[1] || ''}`.trim();
        }
        else if (e.target.name === "lastName") {
            e.target.name = "name";
            e.target.value = `${formData.name.split(' ')[0] || ''} ${e.target.value}`.trim();
        }

        baseHandleChange(e);

        if (e.target.name === 'password') {
            validatePassword(e.target.value);
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

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-6 sm:py-12 px-2 sm:px-4 lg:px-8">
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
                    {message.content && message.type === 'error' && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                            {message.content}
                        </div>
                    )}

                    {message.content && message.type === 'success' && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                            {message.content}
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
                                    value={formData.name.split(' ')[0] || ''}
                                    disabled={oauthSignup && !oauthFieldsRequired.name}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 text-xs sm:text-sm disabled:bg-gray-100"
                                    placeholder="First name"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
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
                                    value={formData.name.split(' ')[1] || ''}
                                    disabled={oauthSignup && !oauthFieldsRequired.name}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 text-xs sm:text-sm disabled:bg-gray-100"
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
                                disabled={oauthSignup && !oauthFieldsRequired.email}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm disabled:bg-gray-100"
                                placeholder="Enter your email address"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
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
                                disabled={oauthSignup && !oauthFieldsRequired.phone}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your phone number"
                            />
                            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
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
                                disabled={oauthSignup && !oauthFieldsRequired.userType}
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

                        <div>
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
                            {errors.agreeToTerms && <p className="mt-1 text-xs text-red-600">{errors.agreeToTerms}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={status !== 'idle' || passwordErrors.length > 0 || !formData.agreeToTerms}
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
                                {status === 'idle' && oauthSignup ? `Complete Signup with ${oauthSignup}` : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    {!oauthSignup && <button
                        type="button"
                        onClick={() => handleOAuthSignIn('google')}
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
                    </button>}

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
                            href={ROUTES.PROPERTIES.ROOT}
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