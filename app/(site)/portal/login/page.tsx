"use client";

import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock, Mail, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = searchParams?.get("callbackUrl") || "/portal";
  const errorParam = searchParams?.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = session.user.role.toLowerCase();
      router.replace(`/portal/${role}`);
    }
  }, [status, session, router]);

  useEffect(() => {
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        CredentialsSignin: "Invalid email or password",
        SessionRequired: "Please sign in to access this page",
        AccessDenied: "You do not have permission to access this resource",
        ACCOUNT_SUSPENDED: "Your account is currently suspended. Please contact administration.",
        TOO_MANY_REQUESTS: "Too many login attempts. Please try again in a few minutes.",
        default: "An error occurred. Please try again.",
      };
      toast.error(errorMessages[errorParam] || errorMessages.default);
    }
  }, [errorParam]);

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "ACCOUNT_SUSPENDED") {
          toast.error("Account Suspended", {
            description: "Your account has been suspended. Contact support for details.",
          });
        } else if (result.error === "TOO_MANY_REQUESTS") {
          toast.error("Rate Limited", {
            description: "Too many login attempts. Please wait a while before trying again.",
          });
        } else {
          toast.error("Authentication Failed", {
            description: "Invalid email or password. Please try again.",
          });
        }
      } else {
        toast.success("Success", { description: "Logged in successfully!" });
        // Redirection is handled by the useEffect on status change
      }
    } catch (error) {
      toast.error("Error", { description: "Something went wrong. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-burgundy-glow p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-panel text-white shadow-2xl border-white/20">
          <CardHeader className="space-y-1 text-center pb-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto mb-4"
            >
              <Image
                src="/images/logo-footer-hq.png"
                alt="The Pioneers High School Logo"
                width={120}
                height={120}
                className="h-24 w-24 object-contain mx-auto drop-shadow-lg"
              />
            </motion.div>
            <CardTitle className="text-3xl font-bold tracking-tight font-serif">Welcome Back</CardTitle>
            <CardDescription className="text-white/70">
              Enter your credentials to access the school portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-white/80">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40 group-focus-within:text-white transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@school.edu"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:ring-white/40 focus:border-white/40 transition-all rounded-lg"
                    {...register("email")}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose-300 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.email.message}
                  </motion.p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-white/80">Password</Label>
                  <Button variant="link" className="px-0 font-normal text-xs text-white/60 hover:text-white">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40 group-focus-within:text-white transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:ring-white/40 focus:border-white/40 transition-all rounded-lg"
                    {...register("password")}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose-300 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.password.message}
                  </motion.p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-primary hover:bg-white/90 font-bold h-11 transition-all shadow-xl rounded-lg active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-white/10 pt-6">
            <div className="text-center text-sm text-white/60">
              Don't have an account?{" "}
              <Button variant="link" className="p-0 font-semibold text-white hover:underline transition-all">
                Contact Administration
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

