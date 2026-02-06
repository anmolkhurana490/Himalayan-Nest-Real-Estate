/**
 * Customer Settings Page
 */

import CustomerSettingsView from '@/features/customer/views/CustomerSettingsView';

export const metadata = {
    title: 'Settings - Himalayan Nest Real Estate',
    description: 'Manage your account settings and preferences',
};

export default function SettingsPage() {
    return <CustomerSettingsView />;
}
