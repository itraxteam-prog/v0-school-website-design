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
                router.push('/portal/login');
            } else if (!allowedRoles.includes(user.role)) {
                router.push('/portal/login');
            }
        }
    }, [user, loading, allowedRoles, router]);

    return { user, loading };
}
