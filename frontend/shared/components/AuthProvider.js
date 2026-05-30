"use client";
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore } from '@/shared/stores/authStore';
import { useAppStore } from '@/shared/stores/appStore';

// Sync NextAuth session with Zustand store
function AuthSync({ children }) {
    const { data: session, status } = useSession();
    const { setUser, clearUser, setAuthChecked, initializeAuth } = useAuthStore();
    const setLoading = useAppStore((state) => state.setLoading);

    // Initialize auth store on mount
    useEffect(() => {
        initializeAuth();
    }, []);

    useEffect(() => {
        if (status === 'loading') {
            setLoading(true);
            return;
        }
        setLoading(false);

        const sessionUser = session?.user?.user || session?.user;

        if (status === 'authenticated' && sessionUser) {
            // Sync session user to Zustand store
            setUser(sessionUser);
            setAuthChecked(true);
        } else if (status === 'unauthenticated') {
            clearUser();
            setAuthChecked(true);
        }
    }, [session, status, setUser, clearUser, setAuthChecked]);

    return <>{children}</>;
}

export default function AuthProvider({ children, session }) {
    return (
        <SessionProvider session={session}>
            <AuthSync>{children}</AuthSync>
        </SessionProvider>
    );
}