"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, useSession, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOffIcon, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

function getRedirectPathByRole(role: string): string {
  switch (role) {
    case "ADMIN": return "/portal/admin";
    case "TEACHER": return "/portal/teacher";
    case "STUDENT": return "/portal/student";
    case "PARENT": return "/portal/parent";
    default: return "/portal/login";
  }
}

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ShieldCheck } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<{ email: string; password: string }>();

  // Handle existing session
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as { role?: string; status?: string };
      if (user.status !== "ACTIVE") {
        toast.error("Account Suspended", {
          description: "Your account is not active. Please contact administration."
        });
        return;
      }

      const role = user.role || "STUDENT";
      router.replace(getRedirectPathByRole(role));
    }
  }, [status, session, router]);

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        code: otpCode
      });

      if (res?.ok) {
        toast.success("Success", { description: "Logged in successfully!" });
        const session = await getSession();
        const role = (session?.user as any)?.role || "STUDENT";
        router.push(getRedirectPathByRole(role));
      } else {
        if (res?.error === "2FA_REQUIRED") {
          setShowOTP(true);
          toast.info("Two-Factor Authentication", {
            description: "Please enter the 6-digit code from your authenticator app."
          });
        } else if (res?.error === "INVALID_2FA_CODE") {
          toast.error("Invalid Code", {
            description: "The 2FA code you entered is incorrect."
          });
          setOtpCode("");
        } else {
          toast.error("Error", {
            description: res?.error === "CredentialsSignin" || res?.error === "Invalid credentials"
              ? "Invalid email or password"
              : res?.error || "Authentication failed. Please try again."
          });
        }
      }
    } catch (error) {
      toast.error("Error", { description: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50 z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-2xl overflow-hidden">
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
                width={100}
                height={100}
                className="h-20 w-20 object-contain mx-auto drop-shadow-md"
              />
            </motion.div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 font-serif">
              {showOTP ? "Verify Identity" : "Portal Login"}
            </CardTitle>
            <CardDescription className="text-slate-500">
              {showOTP
                ? "Enter the 6-digit security code"
                : "Enter your credentials to access your school dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {!showOTP ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      {...register("email")}
                      className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/portal/forgot-password"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className="pl-10 pr-10 h-11 bg-slate-50/50 border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6 flex flex-col items-center">
                <div className="p-3 bg-blue-50 rounded-full">
                  <ShieldCheck className="h-8 w-8 text-blue-600" />
                </div>

                <div className="space-y-4 w-full flex flex-col items-center">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={(value) => setOtpCode(value)}
                    disabled={isLoading}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="h-12 w-12 text-lg border-2 rounded-lg" />
                      <InputOTPSlot index={1} className="h-12 w-12 text-lg border-2 rounded-lg" />
                      <InputOTPSlot index={2} className="h-12 w-12 text-lg border-2 rounded-lg" />
                      <InputOTPSlot index={3} className="h-12 w-12 text-lg border-2 rounded-lg" />
                      <InputOTPSlot index={4} className="h-12 w-12 text-lg border-2 rounded-lg" />
                      <InputOTPSlot index={5} className="h-12 w-12 text-lg border-2 rounded-lg" />
                    </InputOTPGroup>
                  </InputOTP>

                  <p className="text-xs text-slate-500 text-center">
                    Open your authenticator app and enter the 6-digit code.
                  </p>
                </div>

                <div className="w-full space-y-3 pt-2">
                  <Button
                    className="w-full h-11 font-bold shadow-md transition-all active:scale-[0.98]"
                    onClick={() => onSubmit(getValues())}
                    disabled={isLoading || otpCode.length !== 6}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                      "Verify & Login"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-slate-500 hover:text-slate-800"
                    onClick={() => {
                      setShowOTP(false);
                      setOtpCode("");
                    }}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Credentials
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 pt-6">
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
