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
    login: (email: string, password: string, rememberMe: boolean) => Promise<{ requires2FA?: boolean; tempToken?: string } | void>;
    verify2FA: (tempToken: string, code: string, rememberMe: boolean) => Promise<void>;
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

    const safeFetch = async (url: string, options: RequestInit) => {
        try {
            const res = await fetch(url, options);
            const text = await res.text();
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch (e) {
                console.error('Failed to parse JSON response:', text);
                throw new Error('Invalid JSON response from server');
            }

            return { res, data };
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    };

    const checkAuth = async () => {
        try {
            // 1. Try to verify current access token
            let { res, data } = await safeFetch('/api/auth/verify', {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) {
                // 2. If verify fails, try to refresh the session
                const refreshResult = await safeFetch('/api/auth/refresh', {
                    method: 'POST',
                    credentials: 'include'
                });

                if (refreshResult.res.ok) {
                    // 3. If refresh succeeds, try verifying again
                    const verifyResult = await safeFetch('/api/auth/verify', {
                        method: 'GET',
                        credentials: 'include',
                    });
                    res = verifyResult.res;
                    data = verifyResult.data;
                } else {
                    setUser(null);
                    return;
                }
            }

            if (res.ok && data.user) {
                setUser(data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string, rememberMe: boolean) => {
        try {
            const { res, data } = await safeFetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password, rememberMe }),
            });

            if (res.status === 202 && data.requires2FA) {
                return { requires2FA: true, tempToken: data.data?.tempToken || data.tempToken };
            }

            if (!res.ok || !data.success) {
                throw new Error(data.error || data.message || 'Login failed');
            }

            // Set user from response (tokens are handled as HttpOnly cookies by the server)
            // Support both data.data.user (new standard) and data.user (legacy/fallback)
            const userData = data.data?.user || data.user;
            setUser(userData);

            // Redirect based on role
            const role = userData.role;
            const rolePortalMap: Record<string, string> = {
                'admin': '/portal/admin',
                'teacher': '/portal/teacher',
                'student': '/portal/student'
            };

            if (rolePortalMap[role]) {
                router.push(rolePortalMap[role]);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const verify2FA = async (tempToken: string, code: string, rememberMe: boolean) => {
        try {
            const { res, data } = await safeFetch('/api/auth/2fa/verify-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ tempToken, code, rememberMe }),
            });

            if (!res.ok || !data.success) {
                throw new Error(data.error || data.message || '2FA Verification failed');
            }

            const userData = data.data?.user || data.user;
            setUser(userData);

            // Redirect based on role
            const role = userData.role;
            const rolePortalMap: Record<string, string> = {
                'admin': '/portal/admin',
                'teacher': '/portal/teacher',
                'student': '/portal/student'
            };

            if (rolePortalMap[role]) {
                router.push(rolePortalMap[role]);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await safeFetch('/api/auth/logout', {
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
        <AuthContext.Provider value={{ user, loading, login, verify2FA, logout }}>
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
