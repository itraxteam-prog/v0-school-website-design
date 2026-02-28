"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft, Loader2, CheckCircle2, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit } = useForm<{ email: string }>();

    const onSubmit = async (data: { email: string }) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/request-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email }),
            });

            const result = await res.json();
            // Check for res.ok because the API might not return "success: true" but it returns status 200
            if (res.ok) {
                setSubmitted(true);
                toast.success("Link Sent", { description: "If an account exists, a reset link has been sent." });
            } else {
                toast.error("Error", { description: result.error || "Failed to send reset link." });
            }
        } catch (error) {
            toast.error("Error", { description: "Something went wrong. Please try again later." });
        } finally {
            setIsLoading(false);
        }
    };

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
                        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 font-serif">Forgot Password</CardTitle>
                        <CardDescription className="text-slate-500">
                            Recover access to your school portal account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <AnimatePresence mode="wait">
                            {!submitted ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-4"
                                >
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Your Email Address</Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="name@school.edu"
                                                    {...register("email")}
                                                    className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition-all"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                            ) : (
                                                "Send Reset Link"
                                            )}
                                        </Button>
                                    </form>
                                    <div className="text-center pt-2">
                                        <Link
                                            href="/portal/login"
                                            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                            Back to Login
                                        </Link>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-6 py-4"
                                >
                                    <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-slate-900">Check your email</h3>
                                        <p className="text-sm text-slate-500 px-6">
                                            We've sent reset instructions to your inbox if the account exists.
                                        </p>
                                    </div>
                                    <div className="space-y-3 pt-4">
                                        <Link href="/portal/login" className="block">
                                            <Button variant="outline" className="w-full h-11 border-slate-200 hover:bg-slate-50">
                                                Return to Login
                                            </Button>
                                        </Link>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 mx-auto transition-colors"
                                        >
                                            <RotateCcw className="h-3 w-3" />
                                            Try another email
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
