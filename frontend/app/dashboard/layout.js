// Dashboard Layout Component - Protected layout for dealer dashboard
// Provides sidebar navigation, header, and authentication protection for dealer-only pages

"use client";
import React, { useEffect, useState } from "react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
    const [activeTab, setActiveTab] = useState("overview"); // Current active dashboard section
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle
    const { user, authChecked, loading } = useAppContext(); // Authentication state
    const router = useRouter();

    // Redirect non-dealers to login page
    useEffect(() => {
        if (!loading && (!authChecked || user?.role === "customer")) {
            router.push("/login");
        }
    }, [user, loading, authChecked, router]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {/* Loading spinner placeholder */}
            </div>
        );
    }

    // Don't render dashboard for non-dealers
    if (!authChecked || user?.role === "customer") {
        return null;
    }

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
                        user={user}
                    />

                    {/* Page Content Area */}
                    <main className="p-4 lg:p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
