/**
 * Property Save Button Component
 * Toggle button to save/favorite a property
 */

'use client';

import { Heart } from 'lucide-react';
import { useSavedPropertiesViewModel } from '@/features/savedProperties/viewmodel/savedPropertiesViewModel';
import { useAuthStore } from '@/shared/stores/authStore';
import { useRouter } from 'next/navigation';
import ROUTES from '@/config/constants/routes';
import { toast } from 'sonner';

export default function PropertySaveButton({ propertyId, property, className = '' }) {
    const router = useRouter();
    const { user } = useAuthStore();
    const { isSaved, toggleSaveProperty } = useSavedPropertiesViewModel();

    const saved = isSaved(propertyId);

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Redirect to login if not authenticated
        if (!user) {
            router.push(ROUTES.LOGIN);
            return;
        }

        // Only customers can save properties
        if (user.role !== 'customer') {
            return;
        }

        // Pass full property object to toggleSaveProperty
        if (property) {
            const result = await toggleSaveProperty(property);
            if (result?.success) {
                toast.success(result.isSaved ? 'Property saved' : 'Property removed from saved');
            } else if (result?.message) {
                toast.error(result.message);
            }
        } else {
            console.warn('Property object is required to save');
        }
    };

    // Don't show for non-customers
    if (user && user.role !== 'customer') {
        return null;
    }

    return (
        <button
            onClick={handleSave}
            className={`
                flex items-center justify-center
                p-2 rounded-full
                transition-all duration-200
                ${saved
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                }
                ${className}
            `}
            title={saved ? 'Remove from saved' : 'Save property'}
            aria-label={saved ? 'Remove from saved' : 'Save property'}
        >
            <Heart
                className={`w-5 h-5 ${saved ? 'fill-current' : ''}`}
            />
        </button>
    );
}
