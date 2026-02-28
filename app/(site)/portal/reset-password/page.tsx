"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, Lock, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

function ResetPasswordContent() {
    const router = useRouter();
    const params = useSearchParams();
    const token = params.get("token") || "";
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, watch } = useForm<{ password: string }>();

    const password = watch("password", "");

    const onSubmit = async (data: { password: string }) => {
        if (!token) {
            toast.error("Invalid Token", { description: "Reset token is missing. Please request a new link." });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: data.password }),
            });

            const result = await res.json();
            if (res.ok) {
                setSuccess(true);
                toast.success("Success", { description: "Password updated! Redirecting to login..." });
                setTimeout(() => router.push("/portal/login"), 2000);
            } else {
                toast.error("Error", { description: result.error || "Failed to reset password." });
            }
        } catch (error) {
            toast.error("Error", { description: "Something went wrong. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="max-w-md w-full text-center p-8 space-y-6">
                        <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-2xl font-bold text-slate-900 font-serif">Password Updated!</CardTitle>
                            <CardDescription className="text-slate-500">
                                Your password has been changed successfully. Redirecting to the login page...
                            </CardDescription>
                        </div>
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50 z-0" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50 z-0" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-2xl">
                    <CardHeader className="space-y-1 text-center pb-2">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="mx-auto mb-4"
                        >
                            <Image
                                src="/images/logo-footer-hq.png"
                                alt="School Logo"
                                width={80}
                                height={80}
                                className="h-16 w-16 object-contain mx-auto drop-shadow-md"
                            />
                        </motion.div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 font-serif">Reset Password</CardTitle>
                        <CardDescription className="text-slate-500">
                            Create a strong new password for your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {!token ? (
                            <div className="text-center space-y-4 py-4">
                                <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                                    <Lock className="h-6 w-6 text-red-500" />
                                </div>
                                <p className="text-sm text-slate-600">
                                    This password reset link is invalid or has expired.
                                </p>
                                <Link href="/portal/forgot-password">
                                    <Button variant="outline" className="w-full h-11">Request New Link</Button>
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            {...register("password")}
                                            className="pl-10 pr-10 h-11 bg-slate-50/50 border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </button>
                                    </div>

                                    {/* Visual password strength hint */}
                                    {password.length > 0 && (
                                        <div className="flex gap-1 mt-2">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-colors ${password.length >= i * 2 ? (password.length > 8 ? "bg-green-500" : "bg-yellow-500") : "bg-slate-100"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition-all"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 pt-6">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            <ShieldCheck className="h-3 w-3" />
                            Secure Password Encryption
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
