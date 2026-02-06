// Login View - User authentication form
// Handles user login with email/password and redirects based on user role

"use client";
import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthViewModel } from '../viewmodel/authViewModel'
import { loginSchema } from '../validation'
import ROUTES from '@/config/constants/routes'
import Image from 'next/image';
import { useForm } from '@/shared/hooks';

export default function LoginView() {
    const { loginUser, oauthSignIn, isSubmitting: vmSubmitting } = useAuthViewModel();
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        formData,
        errors,
        isSubmitting,
        message,
        handleChange,
        handleSubmit,
        setMessage
    } = useForm(
        { email: '', password: '' },
        loginSchema,
        async (data) => {
            const result = await loginUser(data);
            if (result?.success) {
                router.push(ROUTES.PROPERTIES.ROOT);
            }
            return result;
        }
    );

    // Handle OAuth errors
    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setMessage({ type: 'error', content: 'Authentication failed. Please try again.' });
        }
    }, [searchParams, setMessage]);

    return (
        <div className="min-h-screen bg-gray-50 flex sm:items-center justify-center py-6 sm:py-12 px-2 sm:px-4 lg:px-8">
            <div className="max-w-md w-full space-y-6 sm:space-y-8">
                <div>
                    <div className="text-center">
                        <Link href={ROUTES.HOME} className="text-2xl sm:text-3xl font-bold text-green-700">
                            Himalayan Nest
                        </Link>
                    </div>
                    <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-xs sm:text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <Link href={ROUTES.REGISTER} className="font-medium text-green-600 hover:text-green-500">
                            Create account here
                        </Link>
                    </p>
                </div>

                <div className="bg-white py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 shadow rounded-lg">
                    {message.content && message.type === 'error' && (
                        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-xs sm:text-sm">
                            {message.content}
                        </div>
                    )}

                    <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 text-xs sm:text-sm"
                                placeholder="Enter your email address"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 text-xs sm:text-sm"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-xs sm:text-sm">
                                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                    }`}
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <button
                        type="button"
                        onClick={() => oauthSignIn('google')}
                        disabled={isSubmitting || vmSubmitting}
                        className="mt-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Image
                            src="/logos/google-oauth.svg"
                            alt="Google Logo"
                            width={20} height={20}
                            className="mr-2"
                        />
                        Sign in with Google
                    </button>

                    <div className="mt-4 sm:mt-6">
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 text-center">
                            New to Himalayan Nest?{' '}
                        </p>

                        <Link href={ROUTES.REGISTER} className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            Create your account
                        </Link>
                    </div>

                    <div className="mt-3 sm:mt-4 space-y-2">
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
                    <p className="text-xs sm:text-sm text-gray-600">
                        For dealers and property owners,{' '}
                        <Link href={ROUTES.REGISTER} className="font-medium text-green-600 hover:text-green-500">
                            register as a dealer
                        </Link>{' '}
                        to list your properties.
                    </p>
                </div>
            </div>
        </div >
    )
}