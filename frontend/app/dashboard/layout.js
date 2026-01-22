// Dashboard Layout Component - Protected layout for dealer dashboard
// Provides sidebar navigation, header, and authentication protection for dealer-only pages

"use client";
import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import { withProtectedRoute } from "@/shared/components/RouteProtection";
import { USER_ROLES } from "@/config/constants/user";

function DashboardLayout({ children }) {
    const [activeTab, setActiveTab] = useState("overview"); // Current active dashboard section
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar overlay background */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                </div>
            )}

            <div className="flex">
                {/* Dashboard Sidebar Navigation */}
                <DashboardSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                {/* Main Dashboard Content */}
                <div className="flex-1 lg:mx-auto">
                    {/* Dashboard Header with user info and mobile menu button */}
                    <DashboardHeader
                        setIsSidebarOpen={setIsSidebarOpen}
                    />

                    {/* Page Content Area */}
                    <main className="p-4 lg:p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}

// Protect dashboard with role-based access (dealers and admins only)
export default withProtectedRoute(DashboardLayout, {
    allowedRoles: [USER_ROLES.DEALER, USER_ROLES.ADMIN]
});