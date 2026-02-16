"use client"

import { useState } from "react"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"

export default function ChangePasswordPage() {
    const { user, loading: authLoading } = useRequireAuth(['admin', 'teacher', 'student'])
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    if (authLoading || !user) {
        return null
    }

    // Minimal sidebar items based on role
    const getSidebarItems = (role: string) => {
        switch (role) {
            case 'admin':
                return [
                    { href: "/portal/admin", label: "Dashboard", icon: Lock },
                    { href: "/portal/change-password", label: "Security", icon: ShieldCheck },
                ]
            case 'teacher':
                return [
                    { href: "/portal/teacher", label: "Dashboard", icon: Lock },
                    { href: "/portal/change-password", label: "Security", icon: ShieldCheck },
                ]
            case 'student':
                return [
                    { href: "/portal/student", label: "Dashboard", icon: Lock },
                    { href: "/portal/change-password", label: "Security", icon: ShieldCheck },
                ]
            default:
                return []
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match")
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }),
            })

            const data = await res.json()
            if (res.ok) {
                setSuccess("Your password has been changed successfully.")
                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            } else {
                setError(data.message || "Failed to change password")
            }
        } catch (err) {
            setError("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AppLayout
            sidebarItems={getSidebarItems(user.role)}
            userName={user.name}
            userRole={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        >
            <div className="max-w-2xl mx-auto py-8 px-4">
                <AnimatedWrapper direction="down">
                    <div className="mb-8">
                        <h1 className="heading-1 text-burgundy-gradient">Account Security</h1>
                        <p className="text-sm text-muted-foreground">Manage your password and security settings.</p>
                    </div>
                </AnimatedWrapper>

                <AnimatedWrapper delay={0.1}>
                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                Change Password
                            </CardTitle>
                            <CardDescription>
                                Ensure your account is using a long, random password to stay secure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                {error && (
                                    <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="flex items-center gap-2 rounded-md bg-green-100 p-3 text-sm text-green-700">
                                        <CheckCircle2 className="h-4 w-4" />
                                        {success}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="newPassword"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Min 8 chars, 1 number, 1 special"
                                                value={formData.newPassword}
                                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm your new password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Security Requirements</p>
                                    <ul className="text-xs space-y-1 text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <div className={`h-1.5 w-1.5 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                                            Minimum 8 characters long
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                                            At least one numerical digit (0-9)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className={`h-1.5 w-1.5 rounded-full ${/[!@#$%^&*]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                                            At least one special character (!@#$%^&*)
                                        </li>
                                    </ul>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full md:w-auto h-11 px-8 bg-primary hover:bg-primary/90"
                                    disabled={loading}
                                >
                                    {loading ? "Updating..." : "Update Password"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </AnimatedWrapper>
            </div>
        </AppLayout>
    )
}
