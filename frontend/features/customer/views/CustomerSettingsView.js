/**
 * Customer Settings View
 * User preferences and account settings for customers
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/authStore';
import { useCustomerViewModel } from '@/features/customer/viewmodel/customerViewModel';
import { Settings, ArrowLeft, Save, Bell, Lock, User } from 'lucide-react';
import ROUTES from '@/config/constants/routes';
import Link from 'next/link';
import { useForm } from '@/shared/hooks';

export default function CustomerSettingsView() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { preferences, getPreferences, updatePreferences } = useCustomerViewModel();
    const [activeTab, setActiveTab] = useState('notifications');

    // Define initial form values
    const initialValues = {
        emailNotifications: true,
        pushNotifications: true,
        priceAlerts: false,
        newListingsAlert: false,
    };

    // Define submit handler
    const handleFormSubmit = async (data) => {
        const result = await updatePreferences(data);
        return result;
    };

    const {
        formData,
        errors,
        isSubmitting,
        message,
        handleChange: baseHandleChange,
        handleSubmit,
        setFormData
    } = useForm(initialValues, null, handleFormSubmit);

    // Enhanced handleChange for checkbox inputs
    const handleChange = (e) => {
        const { name, checked } = e.target;
        baseHandleChange({ target: { name, value: checked } });
    };

    useEffect(() => {
        getPreferences();
    }, []);

    useEffect(() => {
        if (preferences) {
            setFormData({
                emailNotifications: preferences.emailNotifications,
                pushNotifications: preferences.pushNotifications,
                priceAlerts: preferences.priceAlerts,
                newListingsAlert: preferences.newListingsAlert,
            });
        }
    }, [preferences, setFormData]);

    if (!user || user.role !== 'customer') {
        router.push(ROUTES.LOGIN);
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-2 sm:px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={ROUTES.ACCOUNT.DASHBOARD}
                        className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 text-gray-600 p-3 rounded-lg">
                            <Settings className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Settings
                            </h1>
                            <p className="text-gray-600">
                                Manage your account preferences
                            </p>
                        </div>
                    </div>
                </div>

                {/* Message Display */}
                {message.content && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success'
                            ? 'bg-green-100 border border-green-400 text-green-700'
                            : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                        {message.content}
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-4 overflow-x-auto">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'notifications'
                                ? 'border-b-2 border-green-600 text-green-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Bell className="w-4 h-4 inline-block mr-2" />
                            Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'account'
                                ? 'border-b-2 border-green-600 text-green-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <User className="w-4 h-4 inline-block mr-2" />
                            Account
                        </button>
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'privacy'
                                ? 'border-b-2 border-green-600 text-green-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Lock className="w-4 h-4 inline-block mr-2" />
                            Privacy
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    {activeTab === 'notifications' && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Notification Preferences
                                </h3>
                                <div className="space-y-4">
                                    <SettingToggle
                                        name="emailNotifications"
                                        label="Email Notifications"
                                        description="Receive updates via email"
                                        checked={formData.emailNotifications}
                                        onChange={handleChange}
                                    />
                                    <SettingToggle
                                        name="pushNotifications"
                                        label="Push Notifications"
                                        description="Receive browser push notifications"
                                        checked={formData.pushNotifications}
                                        onChange={handleChange}
                                    />
                                    <SettingToggle
                                        name="priceAlerts"
                                        label="Price Drop Alerts"
                                        description="Get notified when saved properties drop in price"
                                        checked={formData.priceAlerts}
                                        onChange={handleChange}
                                    />
                                    <SettingToggle
                                        name="newListingsAlert"
                                        label="New Listings Alert"
                                        description="Get notified about new properties matching your preferences"
                                        checked={formData.newListingsAlert}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4" />
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Account Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <p className="text-gray-900">{user.firstName} {user.lastName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <p className="text-gray-900">{user.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Account Type
                                    </label>
                                    <p className="text-gray-900 capitalize">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'privacy' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Privacy & Security
                            </h3>
                            <p className="text-gray-600">
                                Privacy settings and data management options will be available here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SettingToggle({ name, label, description, checked, onChange }) {
    return (
        <div className="flex items-start justify-between py-3">
            <div className="flex-1">
                <label htmlFor={name} className="block text-sm font-medium text-gray-900 mb-1">
                    {label}
                </label>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            <div className="ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        id={name}
                        name={name}
                        checked={checked}
                        onChange={onChange}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
            </div>
        </div>
    );
}
