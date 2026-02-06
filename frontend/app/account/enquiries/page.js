/**
 * Customer Enquiries Page
 * Shows enquiries sent and received
 */

import QueriesManagementView from '@/features/enquiry/views/QueriesManagementView';

export const metadata = {
    title: 'My Enquiries - Himalayan Nest Real Estate',
    description: 'View and manage your property enquiries',
};

export default function EnquiriesPage() {
    return (
        <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-8 bg-gray-50">
            <QueriesManagementView />
        </div>
    );
}
