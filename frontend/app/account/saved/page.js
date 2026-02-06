/**
 * Saved Properties Page
 */

import SavedPropertiesView from '@/features/savedProperties/views/SavedPropertiesView';

export const metadata = {
    title: 'Saved Properties - Himalayan Nest Real Estate',
    description: 'View all your saved and favorite properties',
};

export default function SavedPage() {
    return <SavedPropertiesView />;
}
