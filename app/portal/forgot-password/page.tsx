"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")
    const [demoLink, setDemoLink] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()
            if (res.ok) {
                setSubmitted(true)
                if (data.resetLink) setDemoLink(data.resetLink)
            } else {
                setError(data.message || "Something went wrong")
            }
        } catch (err) {
            setError("Failed to send reset link")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary px-4 py-12">
            <Card className="w-full max-w-md border-border">
                <CardContent className="flex flex-col gap-6 p-6 sm:p-8">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <Image
                            src="/images/logo.png"
                            alt="Logo"
                            width={100}
                            height={100}
                            className="h-20 w-20 object-contain drop-shadow-lg"
                        />
                        <h1 className="text-2xl font-bold text-foreground">Forgot Password?</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {error && (
                                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@school.com"
                                        className="h-11 pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold">Reset Link Sent</h2>
                                <p className="text-sm text-muted-foreground">
                                    We've sent a link to reset your password to <strong>{email}</strong>.
                                </p>
                            </div>

                            {demoLink && (
                                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-left">
                                    <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Demo Mode Only:</p>
                                    <p className="text-xs text-amber-700 mb-2">In a real app, this link would be in your email.</p>
                                    <Link href={demoLink}>
                                        <Button size="sm" variant="outline" className="w-full bg-white border-amber-200 text-amber-700 hover:bg-amber-100">
                                            Go to Reset Page
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            <Link href="/portal/login" className="mt-4">
                                <Button variant="ghost" className="text-sm">
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    )}

                    {!submitted && (
                        <div className="text-center">
                            <Link
                                href="/portal/login"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
