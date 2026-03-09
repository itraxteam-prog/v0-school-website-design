"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Bell, ChevronRight, LogOut, Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"
import { formatName } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"

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
  userImage?: string
}

export function AppLayout({ children, sidebarItems, userName: propUserName, userRole: propUserRole, userImage: propUserImage }: AppLayoutProps) {
  const { data: session } = useSession()

  // Prefer live session data, fallback to props for initial/server-side state
  const userName = session?.user?.name || propUserName || "User"
  const userImage = session?.user?.image || propUserImage
  const userRole = (session?.user?.role || propUserRole || "Member").toLowerCase()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const pathname = usePathname()
  const { logout } = useAuth()
  const { setTheme } = useTheme()

  useEffect(() => {
    // 1. Fetch Global Settings (Logo, School Name)
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setSettings(data)
        }
      })
      .catch(console.error)

    // 2. Fetch Personal Preferences (Theme, etc.)
    fetch('/api/user/preferences')
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.darkMode !== undefined) {
          setTheme(data.darkMode ? "dark" : "light")
        }
      })
      .catch(console.error)

    // 3. Fetch Real-time Notifications/Announcements
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data)
        }
      })
      .catch(console.error)
  }, [setTheme])

  const handleLogout = async () => {
    await logout()
  }

  // ✅ Fix: handle possible null value safely
  const safePathname = pathname ?? ""

  const breadcrumbs = safePathname.split("/").filter(Boolean).slice(1)

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
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-background lg:static lg:!translate-x-0"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Link href="/" prefetch={true} className="flex items-center gap-2">
            {settings?.schoolLogo ? (
              <img src={settings.schoolLogo} alt="Logo" className="h-[40px] w-[40px] rounded object-contain" />
            ) : (
              <Image src="/images/logo.png" alt="Logo" width={60} height={60} className="h-[60px] w-[60px] object-contain" />
            )}
            <div className="hidden sm:block">
              <p className="text-xs font-bold leading-tight text-foreground">{settings?.schoolName || "Pioneers High"}</p>
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
              const isActive = safePathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={true}
                    onClick={() => setSidebarOpen(false)}
                    className="block relative"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 rounded-lg bg-primary/5 border-l-2 border-primary"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 40 }}
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
              {breadcrumbs.map((crumb, i) => {
                const href = "/portal/" + breadcrumbs.slice(0, i + 1).join("/");
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <span key={crumb} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                    {isLast ? (
                      <span className="font-semibold capitalize text-foreground">
                        {crumb.replace(/-/g, " ")}
                      </span>
                    ) : (
                      <Link
                        href={href}
                        prefetch={true}
                        className="capitalize text-muted-foreground hover:text-primary transition-colors"
                      >
                        {crumb.replace(/-/g, " ")}
                      </Link>
                    )}
                  </span>
                );
              })}
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
                      const portalBase = safePathname.startsWith('/portal/admin') ? '/portal/admin' :
                        safePathname.startsWith('/portal/teacher') ? '/portal/teacher' :
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
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
                aria-label="Notifications"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="h-[18px] w-[18px]" />
                {notifications.length > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 top-full mt-2 z-20 w-80 rounded-xl border border-border bg-background shadow-xl overflow-hidden"
                    >
                      <div className="bg-muted/30 p-3 border-b border-border flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notifications</p>
                        {notifications.length > 0 && (
                          <Badge variant="secondary" className="text-[10px]">{notifications.length} New</Badge>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n, i) => (
                            <div key={n.id || i} className="p-3 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer group">
                              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{n.title}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.content}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <Bell className="h-8 w-8 text-muted/30 mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">No new notifications</p>
                          </div>
                        )}
                      </div>
                      <Link
                        href={safePathname.startsWith('/portal/admin') ? '/portal/admin/announcements' :
                          safePathname.startsWith('/portal/teacher') ? '/portal/teacher/announcements' :
                            '/portal/student/announcements'}
                        className="block p-2 text-center text-xs font-semibold text-primary hover:bg-muted transition-colors"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        View All Announcements
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar / Profile */}
            <Link
              href={safePathname.startsWith('/portal/admin') ? '/portal/admin/profile' :
                safePathname.startsWith('/portal/teacher') ? '/portal/teacher/profile' :
                  '/portal/student/profile'}
              className="flex items-center gap-2 hover:bg-muted/50 p-1 rounded-lg transition-colors"
              title="View Profile"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shrink-0 overflow-hidden ring-2 ring-primary/20">
                {userImage ? (
                  <img src={userImage} alt={userName} className="h-full w-full object-cover" />
                ) : (
                  userName && userName.trim()
                    ? userName.trim().split(/\s+/).filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : "U"
                )}
              </div>
              <div className="hidden lg:block mr-2 text-left">
                <p className="text-xs font-semibold text-foreground truncate max-w-[100px] leading-tight">{formatName(userName)}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{userRole}</p>
              </div>
            </Link>

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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
export default AppLayout
