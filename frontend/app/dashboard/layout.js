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
            <div className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 flex-1 lg:mx-auto space-y-1">
                <Link
                    href={ROUTES.PROPERTIES}
                    className="flex items-center w-fit p-1 sm:p-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <MoveLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="ml-2 sm:ml-3">Back to Main Site</span>
                </Link >

                {/* Page Content Area */}
                <main className="py-1 pb-20 lg:pb-6">{children}</main>
            </div>
        </div>
    );
}

// Protect dashboard with role-based access (dealers and admins only)
export default withProtectedRoute(DashboardLayout, {});