/**
 * Customer Account Layout
 * Layout wrapper for customer account pages with route protection
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/authStore';
import ROUTES from '@/config/constants/routes';
import ComparisonWidget from '@/features/customer/components/ComparisonWidget';

export default function AccountLayout({ children }) {
    const router = useRouter();
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
        return null; // or a loading spinner
    }

    return (
        <>
            {children}
            <ComparisonWidget />
        </>
    );
}
