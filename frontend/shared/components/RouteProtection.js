// Route Protection Utilities
// Provides HOCs for protected and reverse-protected routes

"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/authStore';
import ROUTES from '@/config/constants/routes';
import { USER_ROLES } from '@/config/constants/user';

/**
 * Higher-Order Component for Protected Routes
 * Redirects to login if user is not authenticated
 * @param {React.Component} Component - Component to protect
 * @param {Object} options - Protection options
 * @param {Array<string>} options.allowedRoles - Allowed user roles (optional)
 * @param {string} options.redirectTo - Redirect path if unauthorized (default: LOGIN)
 */
export const withProtectedRoute = (Component, options = {}) => {
    return function ProtectedRoute(props) {
        const router = useRouter();
        const { user, authChecked } = useAuthStore();
        const { allowedRoles, redirectTo = ROUTES.REDIRECTS.AUTH_PROTECTED } = options;

        useEffect(() => {
            // Wait for auth check to complete
            if (!authChecked) return;

            // Redirect if not authenticated
            if (!user) {
                router.push(redirectTo);
                return;
            }

            // // Check role-based access if roles specified
            // if (allowedRoles && allowedRoles.length > 0) {
            //     if (!allowedRoles.includes(user.role || user.userType)) {
            //         router.push(ROUTES.HOME);
            //     }
            // }
        }, [user, authChecked, router, redirectTo, allowedRoles]);

        // Show loading while checking auth
        // Don't render if not authenticated
        if (!user || !authChecked) {
            return null;
        }

        // // Don't render if role not allowed
        // if (allowedRoles && allowedRoles.length > 0) {
        //     if (!allowedRoles.includes(user.role || user.userType)) {
        //         return null;
        //     }
        // }

        return <Component {...props} />;
    };
};

/**
 * Higher-Order Component for Reverse Protected Routes
 * Redirects authenticated users away (e.g., login, register pages)
 * @param {React.Component} Component - Component to protect
 * @param {string} redirectTo - Redirect path if authenticated (default: DASHBOARD.OVERVIEW)
 */
export const withReverseProtectedRoute = (Component) => {
    return function ReverseProtectedRoute(props) {
        const router = useRouter();
        const { user, authChecked } = useAuthStore();
        const redirectTo = ROUTES.REDIRECTS.AUTH_RESTRICTED;

        useEffect(() => {
            // Wait for auth check to complete
            if (!authChecked) return;

            // Redirect if authenticated
            if (user) {
                router.push(redirectTo);
            }
        }, [user, authChecked, router, redirectTo]);

        // Show loading while checking auth
        // Don't render if authenticated
        if (user || !authChecked) {
            return null;
        }

        return <Component {...props} />;
    };
};

/**
 * Hook to check if user has required role
 * @param {Array<string>} allowedRoles - Required roles
 * @returns {boolean} - Whether user has required role
 */
export const useRequireRole = (allowedRoles = []) => {
    const { user } = useAuthStore();

    if (!user) return false;
    if (allowedRoles.length === 0) return true;

    return allowedRoles.includes(user.role || user.userType);
};

/**
 * Hook to check if user is authenticated
 * @returns {Object} - Authentication status and user
 */
export const useAuth = () => {
    const { user, authChecked } = useAuthStore();

    return {
        isAuthenticated: !!user,
        user,
        authChecked,
        isAdmin: user?.role === USER_ROLES.ADMIN || user?.userType === USER_ROLES.ADMIN,
        isDealer: user?.role === USER_ROLES.DEALER || user?.userType === USER_ROLES.DEALER,
        isCustomer: user?.role === USER_ROLES.CUSTOMER || user?.userType === USER_ROLES.CUSTOMER,
    };
};
