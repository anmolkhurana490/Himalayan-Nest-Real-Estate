/**
 * Customer Settings Page
 */

import CustomerSettingsView from '@/features/customer/views/CustomerSettingsView';

export const metadata = {
    title: 'My Account - HimaNest',
    description: 'Manage your account settings and preferences',
    robots: { index: false, follow: false },
};

export default function SettingsPage() {
    return <CustomerSettingsView />;
}
