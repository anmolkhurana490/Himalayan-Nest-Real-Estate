// Auth Layout Component - For login/register pages only
// Uses reverse protection to redirect authenticated users away from auth pages

"use client";
import React from "react";
import { withReverseProtectedRoute } from "@/shared/components/RouteProtection";

function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Auth Pages Content (Login/Register) */}
            <main>{children}</main>
        </div>
    );
}

// Prevent authenticated users from accessing login/register pages
export default withReverseProtectedRoute(AuthLayout);
