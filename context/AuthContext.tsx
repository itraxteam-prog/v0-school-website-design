'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    role: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check authentication status on app load
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Call a verify endpoint to check if the cookie is valid
            const res = await fetch('/api/auth/verify', {
                method: 'GET',
                credentials: 'include', // Important for cookies
            });

            if (res.ok) {
                const data = await res.json();
                if (data.user) {
                    setUser(data.user);
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string, rememberMe: boolean) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Important for cookies
                body: JSON.stringify({ email, password, rememberMe }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Login failed');
            }

            // Set user from response
            setUser({
                id: data.id || email,
                role: data.role,
                email: email,
                name: data.name || ''
            });

            // Redirect based on role
            if (data.role === 'admin') {
                router.push('/portal/admin');
            } else if (data.role === 'teacher') {
                router.push('/portal/teacher');
            } else if (data.role === 'student') {
                router.push('/portal/student');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            router.push('/portal/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
