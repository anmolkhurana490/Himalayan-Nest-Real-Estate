// Profile Management View - User profile editing and management
// Re-exported from app/dashboard/profile/page.js to follow MVVM architecture

"use client";
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/shared/stores/authStore';
import { useAuthViewModel } from '@/features/auth/viewmodel/authViewModel';
import { User, Mail, Phone, MapPin, Building, Save } from 'lucide-react';

const ProfileManagementView = () => {
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const { updateUserProfile, error: viewModelError, success: viewModelSuccess, isSubmitting } = useAuthViewModel();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        company: ''
    });
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                company: user.company || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setIsChanged(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isChanged) {
            alert('No changes to save');
            return;
        }

        try {
            const result = await updateUserProfile(formData);

            if (result && result.success) {
                // Update user in store
                setUser({ ...user, ...formData });
                alert('Profile updated successfully!');
                setIsChanged(false);
            } else {
                alert(result.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating your profile');
        }
    };

    const handleReset = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                company: user.company || ''
            });
            setIsChanged(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-2 sm:px-0">
            <div className="mb-4 sm:mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Profile Header */}
                    <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{user?.name || 'User'}</h3>
                            <p className="text-sm text-gray-500">{user?.email || 'email@example.com'}</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                {user?.role || 'Dealer'}
                            </span>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                Full Name
                            </div>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                Email Address
                            </div>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                            disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                Phone Number
                            </div>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 XXXXXXXXXX"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                Address
                            </div>
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter your address"
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                                <Building className="w-4 h-4 mr-2" />
                                Company/Business Name
                            </div>
                        </label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Your company or business name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Account Stats */}
                    <div className="pt-6 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Account Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                <p className="text-xs text-gray-500">Member Since</p>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        year: 'numeric'
                                    }) : 'N/A'}
                                </p>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                <p className="text-xs text-gray-500">Account Status</p>
                                <p className="text-sm font-medium text-green-600 mt-1">Active</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={!isChanged || isSubmitting}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={!isChanged || isSubmitting}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileManagementView;
