// Dashboard Layout Component - Protected layout for dealer dashboard
// Provides sidebar navigation, header, and authentication protection for dealer-only pages

"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";
import { useAuthStore } from "@/shared/stores/authStore";
import { USER_ROLES } from "@/config/constants/user";
import Link from "next/link";
import ROUTES from "@/config/constants/routes";
import { MoveLeft } from "lucide-react";

function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, authChecked } = useAuthStore();

    useEffect(() => {
        if (!authChecked) return;

        // Redirect if not authenticated
        if (!user) {
            router.push(ROUTES.LOGIN);
            return;
        }

        // Redirect customers to their account dashboard
        if (user.role === USER_ROLES.CUSTOMER) {
            router.push(ROUTES.ACCOUNT.DASHBOARD);
            return;
        }

        // Allow only dealers and admins
        if (user.role !== USER_ROLES.DEALER && user.role !== USER_ROLES.ADMIN) {
            router.push(ROUTES.HOME);
        }
    }, [user, authChecked, router]);

    // Show loading while checking auth
    if (!authChecked || !user || user.role === USER_ROLES.CUSTOMER) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Dashboard Sidebar Navigation */}
            <DashboardSidebar />

            {/* Main Dashboard Content */}
            <div className="flex-1 flex flex-col">
                <div className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
                    <Link
                        href={ROUTES.PROPERTIES}
                        className="flex items-center w-fit p-1 sm:p-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <MoveLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="ml-2 sm:ml-3">Back to Main Site</span>
                    </Link>
                </div>

                {/* Page Content Area */}
                <main className="flex-1 px-2 sm:px-4 lg:px-6 pb-6">{children}</main>
            </div>
        </div>
    );
}

export default DashboardLayout;