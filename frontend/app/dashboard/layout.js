// Dashboard Layout Component - Protected layout for dealer dashboard
// Provides sidebar navigation, header, and authentication protection for dealer-only pages

"use client";
import React from "react";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";
import { withProtectedRoute } from "@/shared/components/RouteProtection";
import { USER_ROLES } from "@/config/constants/user";
import Link from "next/link";
import ROUTES from "@/config/constants/routes";
import { MoveLeft } from "lucide-react";

function DashboardLayout({ children }) {

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Dashboard Sidebar Navigation */}
            <DashboardSidebar />

            {/* Main Dashboard Content */}
            <div className="px-4 py-2 flex-1 lg:mx-auto space-y-1">
                <Link
                    href={ROUTES.PROPERTIES}
                    className="flex items-center w-fit p-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <MoveLeft />
                    <span className="ml-3">Back to Main Site</span>
                </Link>

                {/* Page Content Area */}
                <main className="py-1 pb-20 lg:pb-6">{children}</main>
            </div>
        </div>
    );
}

// Protect dashboard with role-based access (dealers and admins only)
export default withProtectedRoute(DashboardLayout, {
    allowedRoles: [USER_ROLES.DEALER, USER_ROLES.ADMIN]
});