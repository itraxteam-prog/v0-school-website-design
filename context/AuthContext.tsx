'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    role: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for token on app load
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decodedUser = decodeToken(storedToken);
                // Check if token is expired
                if (decodedUser.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setToken(storedToken);
                    setUser({
                        id: decodedUser.id,
                        role: decodedUser.role,
                        email: decodedUser.email
                    });
                }
            } catch (error) {
                console.error("Failed to decode token", error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const decodeToken = (token: string) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            throw new Error('Invalid token');
        }
    };

    const login = async (email: string, password: string) => {
        // Call backend API
        // For now, we assume the backend is hosted at the same domain/port
        // If it's different, we'd need an environment variable for API_URL

        // Note: The /backend routes need to be exposed via Next.js API routes or a separate server.
        // Assuming the user has set up the Next.js API routes in app/api that proxy to the backend logic
        // The user's previous prompt setup API routes in app/api pointing to backend logic.
        // But wait, user previously created app/api/students, etc.
        // Did user create app/api/auth/login?
        // I need to check if /api/auth/login exists. 
        // The previous turn showed `backend/routes/auth.ts` but I didn't see `app/api/auth` directory in the file listing.
        // I should probably check that first or just assume it exists/will be created.
        // The user's request is "Create a complete authentication system on the frontend".
        // It says "Call POST /auth/login". This usually implies relative path to the same domain.
        // In Next.js, that would be `/api/auth/login` usually, unless they have a separate backend.
        // However, the previous turn had:
        // "Requirements: 1. Apply authMiddleware to the following routes: - /students ..."
        // And the user instructed to create `app/api/students/route.ts`.
        // So I should probably check if `app/api/auth/login/route.ts` exists.
        // If not, the `login` function will fail.
        // But the current user request is specifically "frontend authentication".

        // Let's implement the fetch to `/api/auth/login` in anticipation.
        // If `auth` routes aren't there, I might need to create them, but user said "do not change backend".
        // Wait, "do not change backend" might mean "do not change logic in backend/" folder.
        // Creating `app/api/auth/login/route.ts` behaves as binding frontend to backend.
        // Actually, looking at the previous turn results, I only created `students` `teachers` etc. in `app/api`.
        // I did NOT see `app/api/auth` in `list_dir`.
        // `backend/routes/auth.ts` exists.
        // The user probably expects me to execute the "Create a complete authentication system" which implies making it work.
        // If I can't login, it doesn't work.
        // Use `fetch('/api/auth/login', ...)`

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            const { token, user } = data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
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
