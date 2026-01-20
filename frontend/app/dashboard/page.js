"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ROUTES from '@/config/constants/routes';

export default function DashboardPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace(ROUTES.DASHBOARD.OVERVIEW);
    }, [router]);
    return null;
}
