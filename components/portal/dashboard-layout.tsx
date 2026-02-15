"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Bell, ChevronRight, LogOut, Menu, Search, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { LucideIcon } from "lucide-react"

export interface SidebarItem {
  href: string
  label: string
  icon: LucideIcon
}

interface DashboardLayoutProps {
  children: React.ReactNode
  sidebarItems: SidebarItem[]
  userName: string
  userRole: string
}

export function DashboardLayout({ children, sidebarItems, userName, userRole }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const breadcrumbs = pathname.split("/").filter(Boolean).slice(1)

  return (
    <div className="flex h-screen overflow-hidden bg-secondary">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-background transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Logo" width={60} height={60} className="h-[60px] w-[60px] object-contain" />
            <div className="hidden sm:block">
              <p className="text-xs font-bold leading-tight text-foreground">Pioneers High</p>
              <p className="text-[10px] text-muted-foreground">{userRole}</p>
            </div>
          </Link>
          <button className="text-muted-foreground lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scroll-smooth" style={{ WebkitOverflowScrolling: "touch" }}>
          <ul className="flex flex-col gap-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                      ? "border-l-2 border-primary bg-primary/5 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border px-3 py-3">
          <Link
            href="/portal/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button className="text-foreground lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <Menu className="h-5 w-5" />
            </button>
            {/* Breadcrumb */}
            <nav className="hidden items-center gap-1 text-sm md:flex" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                  <span className={i === breadcrumbs.length - 1 ? "font-semibold capitalize text-foreground" : "capitalize text-muted-foreground"}>
                    {crumb.replace(/-/g, " ")}
                  </span>
                </span>
              ))}
            </nav>
            {/* Mobile Back */}
            <span className="text-sm font-semibold capitalize text-foreground md:hidden">
              {breadcrumbs[breadcrumbs.length - 1]?.replace(/-/g, " ") || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="h-9 w-48 pl-9 text-sm lg:w-64" />
            </div>
            {/* Notification */}
            <Button variant="ghost" size="icon" className="relative h-9 w-9" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary" />
            </Button>
            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {userName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-foreground">{userName}</p>
                <p className="text-[10px] text-muted-foreground">{userRole}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth" style={{ WebkitOverflowScrolling: "touch" }}>
          {children}
        </main>
      </div>
    </div>
  )
}
