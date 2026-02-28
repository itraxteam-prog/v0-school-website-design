"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

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
        <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-0 md:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="The Pioneers High School Home">
            <Image
              src="/images/logo-new.png"
              alt="The Pioneers High School Logo"
              width={140}
              height={140}
              className="h-[60px] w-[60px] object-contain transition-transform duration-300 hover:scale-105 lg:h-[85px] lg:w-[85px]"
              priority
              quality={100}
            />
            <div className="hidden sm:block">
              <p className="font-serif text-sm font-bold leading-tight text-foreground lg:text-base">
                The Pioneers High School
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground lg:text-xs">
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
                  <span className="mt-0.5 block h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link href={portalHref} prefetch={true}>
              <Button variant="outline" size="sm" className="min-w-[110px] border-primary text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center gap-2">
                {user && <LayoutDashboard className="h-4 w-4" />}
                {portalLabel}
              </Button>
            </Link>
            <Link href="/admissions" prefetch={true}>
              <Button size="sm" className="min-w-[110px] bg-primary text-primary-foreground hover:bg-primary/90 text-center">
                Apply Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="flex h-11 w-11 items-center justify-center rounded-md text-foreground lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 top-[57px] z-40 bg-background lg:hidden">
            <div className="flex flex-col gap-1 px-4 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${pathname === link.href
                    ? "bg-primary/5 text-primary"
                    : "text-foreground hover:bg-muted"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
                <Link href={portalHref} prefetch={true} onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center gap-2">
                    {user && <LayoutDashboard className="h-4 w-4" />}
                    {portalLabel}
                  </Button>
                </Link>
                <Link href="/admissions" prefetch={true} onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
