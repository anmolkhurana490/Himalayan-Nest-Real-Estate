/**
 * Saved Properties Page
 */

import SavedPropertiesView from '@/features/savedProperties/views/SavedPropertiesView';

export const metadata = {
    title: 'My Account - HimaNest',
    description: 'View all your saved and favorite properties',
    robots: { index: false, follow: false },
};

export default function SavedPage() {
    return <SavedPropertiesView />;
}
