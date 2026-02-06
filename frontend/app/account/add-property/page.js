/**
 * Add Property Page for Customers
 * Reuses dealer create property view
 */

import CreatePropertyView from '@/features/properties/views/CreatePropertyView';

export const metadata = {
    title: 'Add Property - Himalayan Nest Real Estate',
    description: 'List your property for sale or rent',
};

export default function AddPropertyPage() {
    return <CreatePropertyView />;
}
