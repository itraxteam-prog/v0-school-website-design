"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Bell, ChevronRight, LogOut, Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { LucideIcon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export interface SidebarItem {
  href: string
  label: string
  icon: LucideIcon
}

interface AppLayoutProps {
  children: React.ReactNode
  sidebarItems: SidebarItem[]
  userName: string
  userRole: string
}

export function AppLayout({ children, sidebarItems, userName, userRole }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const pathname = usePathname()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  const breadcrumbs = pathname.split("/").filter(Boolean).slice(1)

  return (
    <div className="flex h-screen overflow-hidden bg-secondary">
      {/* Sidebar Overlay (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : "-100%",
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-background lg:static lg:!translate-x-0"
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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground lg:hidden"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(false);
            }}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
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
                    className="block relative"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 rounded-lg bg-primary/5 border-l-2 border-primary"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span
                      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                    >
                      <item.icon className="h-[18px] w-[18px]" />
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border px-3 py-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </motion.aside>

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
            <span className="text-sm font-semibold capitalize text-foreground md:hidden truncate max-w-[120px]">
              {breadcrumbs[breadcrumbs.length - 1]?.replace(/-/g, " ") || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search - Visible on desktop, clickable icon on mobile */}
            <div className="relative">
              <div className={`${isSearchVisible ? 'fixed inset-x-0 top-0 h-14 z-50 bg-background flex items-center px-4 md:relative md:inset-auto md:h-auto md:bg-transparent md:px-0 md:flex' : 'hidden sm:block'}`}>
                <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground md:left-3" />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      const portalBase = pathname.startsWith('/portal/admin') ? '/portal/admin' :
                        pathname.startsWith('/portal/teacher') ? '/portal/teacher' :
                          '/portal/student';
                      window.location.href = `${portalBase}/search?q=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                  className="w-full md:w-auto"
                >
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.currentTarget.form?.requestSubmit();
                      }
                    }}
                    className="h-9 w-full pl-9 text-xs transition-all focus:ring-primary md:w-40 md:focus:w-48 lg:w-64"
                    autoFocus={isSearchVisible}
                  />
                </form>
                {isSearchVisible && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 md:hidden"
                    onClick={() => setIsSearchVisible(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:hidden"
                onClick={() => setIsSearchVisible(true)}
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" />
              </Button>
            </div>
            {/* Notification */}
            <Button variant="ghost" size="icon" className="relative h-9 w-9" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary" />
            </Button>
            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shrink-0">
                {userName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="hidden lg:block mr-2">
                <p className="text-xs font-semibold text-foreground truncate max-w-[100px]">{userName}</p>
                <p className="text-[10px] text-muted-foreground">{userRole}</p>
              </div>
            </div>

            {/* Header Logout - Visible on desktop */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden h-9 w-9 text-muted-foreground hover:text-destructive md:flex"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth" style={{ WebkitOverflowScrolling: "touch" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
export default AppLayout
