'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function useRequireAuth(allowedRoles: string[]) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (!allowedRoles.includes(user.role)) {
                // Redirect logged-in users to their own portal if they try to access a restricted page
                const rolePortalMap: Record<string, string> = {
                    'admin': '/portal/admin',
                    'teacher': '/portal/teacher',
                    'student': '/portal/student'
                };

                const userPortal = rolePortalMap[user.role];
                if (userPortal) {
                    router.push(userPortal);
                } else {
                    router.push('/login');
                }
            }
        }
    }, [user, loading, allowedRoles, router]);

    return { user, loading };
}
