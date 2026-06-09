/**
 * Customer Dashboard Page
 */

import CustomerDashboardView from '@/features/customer/views/CustomerDashboardView';

export const metadata = {
    title: 'My Account - Himalayan Nest Real Estate',
    description: 'Manage your saved properties, listings, and account settings',
    robots: { index: false, follow: false },
};

export default function DashboardPage() {
    return <CustomerDashboardView />;
}
