/**
 * Customer Account Layout
 * Layout wrapper for customer account pages with route protection
 */

'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/authStore';
import ROUTES from '@/config/constants/routes';
import ComparisonWidget from '@/features/customer/components/ComparisonWidget';

export default function AccountLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, authChecked } = useAuthStore();

    useEffect(() => {
        // Wait for auth check to complete
        if (!authChecked) return;

        // Redirect if not authenticated
        if (!user) {
            router.push(ROUTES.LOGIN);
            return;
        }

        // protected for customer role
        if (user.role !== 'customer') {
            router.push(ROUTES.DASHBOARD.ROOT);
        }
    }, [user, authChecked, router]);

    if (!authChecked || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'customer') {
        return null;
    }

    return (
        <>
            {children}
            <ComparisonWidget />
        </>
    );
}
