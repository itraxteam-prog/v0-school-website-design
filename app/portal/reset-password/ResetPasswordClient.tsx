"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react"

import { validatePassword } from "@/utils/validation"

export default function ResetPasswordClient() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        const validation = validatePassword(password)
        if (!validation.isValid) {
            setError(`Weak password: ${validation.feedback[0]}`)
            return
        }

        setLoading(true)

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // For mock purposes, always succeed
            setSuccess(true)
            setTimeout(() => router.push("/portal/login"), 3000)
        } catch (err) {
            setError("Failed to reset password")
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
                <Card className="w-full max-w-md border-destructive/20 bg-destructive/5">
                    <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                        <AlertTriangle className="h-12 w-12 text-destructive" />
                        <h1 className="text-xl font-bold">Invalid Reset Link</h1>
                        <p className="text-sm text-muted-foreground">
                            This password reset link is invalid or has expired. Please request a new one.
                        </p>
                        <Link href="/portal/forgot-password">
                            <Button variant="default" className="mt-2">Request New Link</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary px-4 py-12">
            <Card className="w-full max-w-md border-border">
                <CardContent className="flex flex-col gap-6 p-6 sm:p-8">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <Image
                            src="/images/logo.png"
                            alt="Logo"
                            width={80}
                            height={80}
                            className="h-16 w-16 object-contain"
                        />
                        <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter and confirm your new password below.
                        </p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {error && (
                                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min 8 characters"
                                        className="h-11 pl-10 pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Repeat new password"
                                        className="h-11 pl-10 pr-10"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg bg-muted/50 p-3 text-[11px] text-muted-foreground">
                                <p className="font-semibold mb-1 uppercase tracking-wider">Password Requirements:</p>
                                <ul className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
                                    <li className={`flex items-center gap-1.5 ${password.length >= 8 ? "text-green-600 font-medium" : ""}`}>
                                        <div className={`h-1 w-1 rounded-full ${password.length >= 8 ? "bg-green-600" : "bg-muted-foreground"}`} />
                                        At least 8 characters
                                    </li>
                                    <li className={`flex items-center gap-1.5 ${/[A-Z]/.test(password) ? "text-green-600 font-medium" : ""}`}>
                                        <div className={`h-1 w-1 rounded-full ${/[A-Z]/.test(password) ? "bg-green-600" : "bg-muted-foreground"}`} />
                                        One uppercase letter
                                    </li>
                                    <li className={`flex items-center gap-1.5 ${/[a-z]/.test(password) ? "text-green-600 font-medium" : ""}`}>
                                        <div className={`h-1 w-1 rounded-full ${/[a-z]/.test(password) ? "bg-green-600" : "bg-muted-foreground"}`} />
                                        One lowercase letter
                                    </li>
                                    <li className={`flex items-center gap-1.5 ${/[0-9]/.test(password) ? "text-green-600 font-medium" : ""}`}>
                                        <div className={`h-1 w-1 rounded-full ${/[0-9]/.test(password) ? "bg-green-600" : "bg-muted-foreground"}`} />
                                        One number
                                    </li>
                                    <li className={`flex items-center gap-1.5 ${/[^A-Za-z0-9]/.test(password) ? "text-green-600 font-medium" : ""}`}>
                                        <div className={`h-1 w-1 rounded-full ${/[^A-Za-z0-9]/.test(password) ? "bg-green-600" : "bg-muted-foreground"}`} />
                                        One special character
                                    </li>
                                </ul>
                            </div>

                            <Button
                                type="submit"
                                className="h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                                disabled={loading}
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 animate-bounce">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold">Password Reset Successful</h2>
                                <p className="text-sm text-muted-foreground">
                                    Your password has been updated. Redirecting to login...
                                </p>
                            </div>
                            <Link href="/portal/login" className="w-full">
                                <Button className="w-full">Login Now</Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
