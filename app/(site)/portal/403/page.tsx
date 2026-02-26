"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ShieldAlert, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ForbiddenPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-panel max-w-md border-border/50 p-8 shadow-2xl"
            >
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-destructive/10 p-4 text-destructive">
                        <ShieldAlert size={48} />
                    </div>
                </div>

                <h1 className="heading-1 mb-2 text-burgundy-gradient">403 Forbidden</h1>
                <p className="mb-8 text-muted-foreground">
                    Oops! It seems you don't have permission to access this page.
                    Please contact your administrator if you believe this is an error.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="javascript:history.back()">
                            <ArrowLeft size={16} />
                            Go Back
                        </Link>
                    </Button>
                    <Button asChild className="gap-2 bg-primary text-primary-foreground">
                        <Link href="/">
                            <Home size={16} />
                            Home Page
                        </Link>
                    </Button>
                </div>
            </motion.div>

            <p className="mt-8 text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Pioneers High School Management System
            </p>
        </div>
    )
}
