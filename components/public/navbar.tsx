"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"

import { ScrollProgress } from "@/components/ui/scroll-progress"

import { PUBLIC_NAV_LINKS as navLinks } from "@/lib/navigation-config"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const portalHref = user ? `/portal/${user.role.toLowerCase()}` : "/portal/login"
  const portalLabel = "Login"

  return (
    <>
      <ScrollProgress />
      <header className="sticky top-0 z-50 glass-panel">
        <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-4 h-16 md:h-20 lg:h-24 md:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3" aria-label="The Pioneers High School Home">
            <Image
              src="/images/logo-new.png"
              alt="The Pioneers High School Logo"
              width={100}
              height={100}
              className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 object-contain transition-transform duration-300 hover:scale-105"
              priority
              quality={100}
            />
            <div className="flex flex-col">
              <p className="font-serif text-[13px] sm:text-sm lg:text-base font-bold leading-none text-foreground">
                The Pioneers High School
              </p>
              <p className="text-[9px] sm:text-[10px] lg:text-xs font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
                The Institute for Quality Education
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${pathname === link.href
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
                  }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span layoutId="nav-underline" className="mt-0.5 block h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link href={portalHref} prefetch={true}>
              <Button variant="outline" size="sm" className="min-w-[100px] border-primary text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center gap-2">
                {user && <LayoutDashboard className="h-4 w-4" />}
                {portalLabel}
              </Button>
            </Link>
            <Link href="/admissions" prefetch={true}>
              <Button size="sm" className="min-w-[100px] bg-primary text-primary-foreground hover:bg-primary/90 text-center">
                Apply Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <Link href={portalHref} className="sm:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary"><LayoutDashboard size={20} /></Button>
            </Link>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-primary" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[64px] z-40 bg-white/95 backdrop-blur-xl lg:hidden flex flex-col p-6 safe-p-bottom"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={link.href}
                >
                  <Link
                    href={link.href}
                    prefetch={true}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-4 text-lg font-bold transition-all ${pathname === link.href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground active:bg-muted"
                      }`}
                  >
                    {link.label}
                    <ChevronRight size={18} opacity={0.5} />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              <Link href={portalHref} prefetch={true} onClick={() => setMobileOpen(false)} className="block">
                <Button size="lg" variant="outline" className="w-full h-14 rounded-2xl border-primary text-primary text-lg font-bold flex items-center justify-center gap-3">
                  <LayoutDashboard className="h-5 w-5" />
                  Access Portal
                </Button>
              </Link>
              <Link href="/admissions" prefetch={true} onClick={() => setMobileOpen(false)} className="block">
                <Button size="lg" className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold shadow-burgundy-glow/20">
                  Admissions Open
                </Button>
              </Link>

              <div className="flex justify-center pt-4 opacity-40">
                <p className="text-[10px] font-bold uppercase tracking-widest leading-none">The Pioneers High School</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
