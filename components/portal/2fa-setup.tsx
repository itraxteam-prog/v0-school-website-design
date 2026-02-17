"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    ShieldCheck,
    ShieldAlert,
    Key,
    Copy,
    CheckCircle2,
    RefreshCw,
    QrCode as QrCodeIcon,
    Smartphone
} from "lucide-react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "sonner"
import Image from "next/image"

export default function TwoFactorSetup() {
    const { user } = useAuth()
    const [isEnabled, setIsEnabled] = useState(false)
    const [isSettingUp, setIsSettingUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const [setupData, setSetupData] = useState<{ secret: string; qrCode: string } | null>(null)
    const [verificationCode, setVerificationCode] = useState("")
    const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null)

    useEffect(() => {
        // In a real app, you'd fetch the user's current 2FA status from the server
        // For now, we'll check the user object if it has this info
        // But since it's HttpOnly cookie based, we might need an endpoint to check.
        const checkStatus = async () => {
            try {
                const res = await fetch('/api/auth/verify', { credentials: 'include' })
                const result = await res.json()
                const userData = result.data?.user || result.user;
                if (userData) {
                    setIsEnabled(!!userData.two_factor_enabled)
                }
            } catch (err) {
                console.error('Failed to check 2FA status')
            }
        }
        checkStatus()
    }, [])

    const handleStartSetup = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/auth/2fa/setup', { method: 'POST' })
            const result = await res.json()
            if (res.ok && result.success) {
                setSetupData(result.data)
                setIsSettingUp(true)
            } else {
                toast.error(result.error || result.message || "Failed to initiate 2FA setup")
            }
        } catch (err) {
            toast.error("An error occurred during setup")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyAndEnable = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/auth/2fa/enable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: verificationCode })
            })
            const result = await res.json()
            if (res.ok && result.success) {
                setIsEnabled(true)
                setIsSettingUp(false)
                setRecoveryCodes(result.data?.recoveryCodes || result.recoveryCodes)
                toast.success("Two-factor authentication enabled!")
            } else {
                toast.error(result.error || result.message || "Verification failed")
            }
        } catch (err) {
            toast.error("An error occurred during verification")
        } finally {
            setLoading(false)
        }
    }

    const handleDisable = async () => {
        // In a real app, you might want to prompt for password here
        if (!confirm("Are you sure you want to disable 2FA? Your account will be less secure.")) return

        setLoading(true)
        try {
            const res = await fetch('/api/auth/2fa/disable', { method: 'POST', body: JSON.stringify({}) })
            const result = await res.json()
            if (res.ok && result.success) {
                setIsEnabled(false)
                setRecoveryCodes(null)
                toast.success("2FA has been disabled")
            } else {
                toast.error(result.error || result.message || "Failed to disable 2FA")
            }
        } catch (err) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card className="glass-panel border-border/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isEnabled ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Two-Factor Authentication (2FA)</CardTitle>
                                <CardDescription>
                                    Protect your account with an additional layer of security.
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isEnabled ? 'text-green-600' : 'text-amber-600'}`}>
                                {isEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <Switch
                                checked={isEnabled}
                                onCheckedChange={(checked) => {
                                    if (checked) handleStartSetup()
                                    else handleDisable()
                                }}
                                disabled={loading || isSettingUp}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!isEnabled && !isSettingUp && (
                        <div className="flex flex-col md:flex-row gap-6 items-center bg-primary/5 p-6 rounded-xl border border-primary/10">
                            <div className="p-4 rounded-full bg-primary/10 text-primary">
                                <Smartphone className="h-10 w-10" />
                            </div>
                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <h3 className="font-bold text-lg">Authenticator App</h3>
                                <p className="text-sm text-muted-foreground">
                                    Use an app like Google Authenticator, Microsoft Authenticator, or Authy to generate verification codes.
                                </p>
                                <Button onClick={handleStartSetup} disabled={loading} className="mt-2 shadow-burgundy-glow">
                                    {loading ? 'Processing...' : 'Set Up Authenticator'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {isSettingUp && setupData && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid md:grid-cols-2 gap-8 items-start">
                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs">1</span>
                                        Scan QR Code
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Open your authenticator app and scan this QR code or enter the secret key manually.
                                    </p>
                                    <div className="bg-white p-4 rounded-xl border border-border shadow-sm inline-block mx-auto md:mx-0">
                                        <Image src={setupData.qrCode} alt="QR Code" width={200} height={200} className="w-48 h-48" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Secret Key</Label>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 p-2 bg-muted rounded border text-sm font-mono break-all line-clamp-1">
                                                {setupData.secret}
                                            </code>
                                            <Button variant="outline" size="icon" onClick={() => copyToClipboard(setupData.secret)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs">2</span>
                                        Verify Code
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Enter the 6-digit code currently displayed in your authenticator app to confirm setup.
                                    </p>
                                    <div className="flex justify-center md:justify-start pt-2">
                                        <InputOTP
                                            maxLength={6}
                                            value={verificationCode}
                                            onChange={(value) => setVerificationCode(value)}
                                        >
                                            <InputOTPGroup className="gap-2">
                                                <InputOTPSlot index={0} className="rounded-md border-2 h-12 w-10" />
                                                <InputOTPSlot index={1} className="rounded-md border-2 h-12 w-10" />
                                                <InputOTPSlot index={2} className="rounded-md border-2 h-12 w-10" />
                                                <InputOTPSlot index={3} className="rounded-md border-2 h-12 w-10" />
                                                <InputOTPSlot index={4} className="rounded-md border-2 h-12 w-10" />
                                                <InputOTPSlot index={5} className="rounded-md border-2 h-12 w-10" />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                        <Button onClick={handleVerifyAndEnable} disabled={loading || verificationCode.length < 6} className="bg-primary shadow-burgundy-glow flex-1">
                                            {loading ? 'Verifying...' : 'Enable 2FA'}
                                        </Button>
                                        <Button variant="outline" onClick={() => setIsSettingUp(false)} disabled={loading} className="flex-1">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isEnabled && recoveryCodes && (
                        <div className="bg-green-50/50 p-6 rounded-xl border border-green-200 space-y-4 animate-in zoom-in duration-300">
                            <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle2 className="h-5 w-5" />
                                <h3 className="font-bold">Save your recovery codes</h3>
                            </div>
                            <p className="text-sm text-green-600/80 leading-relaxed">
                                If you lose access to your authenticator device, you can use these one-time codes to sign in to your account. Store them in a secure place.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-2">
                                {recoveryCodes.map((code, i) => (
                                    <div key={i} className="p-2 bg-white rounded border border-green-200 text-center font-mono text-sm uppercase">
                                        {code}
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button variant="outline" size="sm" className="bg-white border-green-200 text-green-700 hover:bg-green-50" onClick={() => copyToClipboard(recoveryCodes.join('\n'))}>
                                    <Copy className="h-3.5 w-3.5 mr-2" />
                                    Copy all
                                </Button>
                                <Button variant="outline" size="sm" className="bg-white border-green-200 text-green-700 hover:bg-green-50" onClick={() => window.print()}>
                                    <RefreshCw className="h-3.5 w-3.5 mr-2" />
                                    Print codes
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="glass-panel border-border/50">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-100 text-red-600">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Account Recovery</CardTitle>
                            <CardDescription>
                                Manage how you can regain access if you lose your 2FA device.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div className="space-y-0.5">
                            <h4 className="font-medium">Recovery Codes</h4>
                            <p className="text-sm text-muted-foreground">View or regenerate your one-time recovery codes.</p>
                        </div>
                        <Button variant="outline" disabled={!isEnabled}>View Codes</Button>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div className="space-y-0.5">
                            <h4 className="font-medium">Email Recovery</h4>
                            <p className="text-sm text-muted-foreground">Use your registered email to receive a recovery link.</p>
                        </div>
                        <Button variant="outline" disabled>Configure</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
