/**
 * Customer Properties Page
 * Shows properties listed by the customer (seller mode)
 */
import PropertiesManagementView from '@/features/properties/views/PropertiesManagementView';

export const metadata = {
    title: 'My Properties - Himalayan Nest Real Estate',
    description: 'Manage your property listings',
};

export default function MyPropertiesPage() {
    return (
        <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-8 bg-gray-50">
            <PropertiesManagementView />
        </div >
    )
}
