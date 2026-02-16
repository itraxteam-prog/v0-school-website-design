"use client"

import React from "react"
import { useAuth } from "@/context/AuthContext"

interface RoleGuardProps {
    children: React.ReactNode
    allowedRoles: string[]
    fallback?: React.ReactNode
}

/**
 * RoleGuard component to conditionally render content based on user role
 * 
 * @example
 * <RoleGuard allowedRoles={['admin']}>
 *   <button>Admin Action</button>
 * </RoleGuard>
 */
export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
    const { user, loading } = useAuth()

    if (loading) return null

    if (!user || !allowedRoles.includes(user.role)) {
        return <>{fallback}</>
    }

    return <>{children}</>
}
