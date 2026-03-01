"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export function ChangePasswordForm({ user }: { user: any }) {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match")
            return
        }

        if (formData.newPassword.length < 8) {
            setError("Password must be at least 8 characters long")
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
                toast.success("Password updated successfully")
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
        <Card className="glass-panel border-border/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Change Password
                </CardTitle>
                <CardDescription>
                    Update your password regularly to keep your account secure.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {error && (
                        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in duration-300">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 rounded-md bg-green-100 p-3 text-sm text-green-700 animate-in fade-in duration-300">
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
                                className="bg-background/50"
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
                                    className="bg-background/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
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
                                className="bg-background/50"
                            />
                        </div>
                    </div>

                    <div className="rounded-lg bg-secondary/30 p-4 space-y-2 border border-border/50">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Requirements</p>
                        <ul className="text-xs space-y-1.5 text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                                At least 8 characters long
                            </li>
                            <li className="flex items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                                One numerical digit (0-9)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${/[!@#$%^&*]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                                One special character (!@#$%^&*)
                            </li>
                        </ul>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 bg-primary text-primary-foreground shadow-burgundy-glow hover:bg-primary/90 transition-all duration-300"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
