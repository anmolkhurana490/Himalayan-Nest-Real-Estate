/**
 * Add Property Page for Customers
 * Reuses dealer create property view
 */

import CreatePropertyView from '@/features/properties/views/CreatePropertyView';

export const metadata = {
    title: 'My Account - Himalayan Nest Real Estate',
    description: 'Add your property for sale or rent',
    robots: { index: false, follow: false },
};

export default function AddPropertyPage() {
    return <CreatePropertyView />;
}
