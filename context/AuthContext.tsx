'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_USERS } from '@/utils/mocks';

interface User {
    id: string;
    role: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string, rememberMe: boolean) => Promise<{ requires2FA?: boolean; tempToken?: string; user?: User } | void>;
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

    const checkAuth = async () => {
        setLoading(true);
        try {
            const storedUser = localStorage.getItem('auth_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string, rememberMe: boolean) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const userData = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!userData) {
                throw new Error('Invalid email or password');
            }

            // In a real app, we'd verify the password here. 
            // For mock purposes, any non-empty password works.
            if (!password) {
                throw new Error('Password is required');
            }

            const userToSet = {
                id: userData.id,
                role: userData.role.toLowerCase(),
                email: userData.email,
                name: userData.name
            };

            setUser(userToSet);
            localStorage.setItem('auth_user', JSON.stringify(userToSet));

            // Redirect based on role
            const rolePortalMap: Record<string, string> = {
                'admin': '/portal/admin',
                'teacher': '/portal/teacher',
                'student': '/portal/student'
            };

            if (rolePortalMap[userToSet.role]) {
                router.push(rolePortalMap[userToSet.role]);
            }

            return { user: userToSet };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const verify2FA = async (tempToken: string, code: string, rememberMe: boolean) => {
        // Simplified mock 2FA - always succeeds with the student role for demo
        const studentUser = MOCK_USERS.find(u => u.role === 'student');
        if (studentUser) {
            const userToSet = {
                id: studentUser.id,
                role: studentUser.role.toLowerCase(),
                email: studentUser.email,
                name: studentUser.name
            };
            setUser(userToSet);
            localStorage.setItem('auth_user', JSON.stringify(userToSet));
            router.push('/portal/student');
        }
    };

    const logout = async () => {
        try {
            localStorage.removeItem('auth_user');
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
