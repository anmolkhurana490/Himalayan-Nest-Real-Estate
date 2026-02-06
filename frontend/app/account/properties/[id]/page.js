/**
 * Account Property Detail Page
 * Detailed view for customer's property listing
 */

import MyPropertyDetailView from '@/features/properties/views/MyPropertyDetailView';

export default function AccountPropertyDetailPage() {
    return (
        <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-8 bg-gray-50">
            <MyPropertyDetailView />
        </div >
    )
}