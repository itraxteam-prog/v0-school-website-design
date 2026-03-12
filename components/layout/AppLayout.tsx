"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Bell, ChevronRight, LogOut, Menu, Search, X, LayoutDashboard, Megaphone, User, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface SidebarItem {
  href: string
  label: string
  icon: any // Now accepting string icon names
}

import * as Icons from "lucide-react"

const IconMap: Record<string, Icons.LucideIcon> = {
  LayoutDashboard: Icons.LayoutDashboard,
  GraduationCap: Icons.GraduationCap,
  Users: Icons.Users,
  School: Icons.School,
  Clock: Icons.Clock,
  BarChart3: Icons.BarChart3,
  FileBarChart: Icons.FileBarChart,
  Settings: Icons.Settings,
  ShieldCheck: Icons.ShieldCheck,
  BookMarked: Icons.BookMarked,
  CalendarCheck: Icons.CalendarCheck,
  User: Icons.User,
  FileText: Icons.FileText,
  Megaphone: Icons.Megaphone,
  Calendar: Icons.Calendar,
  BookOpen: Icons.BookOpen,
}

interface AppLayoutProps {
  children: React.ReactNode
  sidebarItems: SidebarItem[]
  userName: string
  userRole: string
  userImage?: string
  initialIsDark?: boolean
  initialPreferences?: any
}

// Module-level cache to survive client-side navigation
let cachedSettings: any = null;
let cachedPreferences: any = null;

export function AppLayout({
  children,
  sidebarItems,
  userName: propUserName,
  userRole: propUserRole,
  userImage: propUserImage,
  initialIsDark = false,
  initialPreferences = null
}: AppLayoutProps) {
  const { data: session } = useSession()
  const isMobile = useIsMobile()

  // Prefer live session data, fallback to props for initial/server-side state
  const userName = session?.user?.name || propUserName || "User"
  const userImage = session?.user?.image || propUserImage
  const userRole = (session?.user?.role || propUserRole || "Member").toLowerCase()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(cachedSettings)
  const [isDark, setIsDark] = useState(initialIsDark)
  const pathname = usePathname()
  const { logout } = useAuth()
  const portalRef = useRef<HTMLDivElement>(null)

  // Identify portal and its specific theme key
  const portalSegment = pathname?.split('/')[2] || (pathname?.startsWith('/portal') ? pathname?.split('/')[1] : null);
  const themeKey = portalSegment ? `darkMode_${portalSegment}` : 'darkMode';

  if (!cachedPreferences && initialPreferences) {
    cachedPreferences = initialPreferences;
  }

  useEffect(() => {
    // 1. Listen for theme-update events (emitted by individual portal components)
    const handleThemeUpdate = (e: any) => {
      if (e.detail?.isDark !== undefined) {
        setIsDark(e.detail.isDark);
        if (cachedPreferences) {
          cachedPreferences[themeKey] = e.detail.isDark;
        } else {
          cachedPreferences = { [themeKey]: e.detail.isDark };
        }
      }
    };
    window.addEventListener('theme-update', handleThemeUpdate);

    // 2. Fetch Global Settings (Logo, School Name) - Use Cache if available
    if (cachedSettings) {
      setSettings(cachedSettings);
    } else {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            cachedSettings = data;
            setSettings(data);
          }
        })
        .catch(console.error)
    }

    // 3. Fetch Personal Preferences (Theme, etc.) - Apply to state
    // Use initialPreferences if available to skip the first fetch
    if (cachedPreferences) {
      const isPortalDark = cachedPreferences[themeKey] === true || (cachedPreferences[themeKey] === undefined && cachedPreferences.darkMode === true);
      setIsDark(isPortalDark);
    } else {
      fetch('/api/user/preferences')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            cachedPreferences = data;
            // Use portal-specific key if it exists, otherwise fallback to universal darkMode
            const isPortalDark = data[themeKey] === true || (data[themeKey] === undefined && data.darkMode === true);
            setIsDark(isPortalDark);
          }
        })
        .catch(console.error)
    }

    // 4. Fetch Real-time Notifications/Announcements
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setNotifications(data)
        } else {
          setNotifications([])
        }
      })
      .catch((err) => {
        console.error("Notifications fetch failed", err);
        setNotifications([]);
      })

    return () => window.removeEventListener('theme-update', handleThemeUpdate);
  }, [themeKey])

  const handleLogout = async () => {
    await logout()
  }

  const safePathname = pathname ?? ""
  const breadcrumbs = safePathname.split("/").filter(Boolean).slice(1)
  const portalBase = safePathname.startsWith('/portal/admin') ? '/portal/admin' :
    safePathname.startsWith('/portal/teacher') ? '/portal/teacher' :
      safePathname.startsWith('/portal/parent') ? '/portal/parent' :
        '/portal/student';

  return (
    <div
      ref={portalRef}
      data-portal-root
      className={`flex h-[100dvh] w-screen overflow-hidden bg-secondary ${isDark ? 'portal-dark' : ''}`}
    >
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

      {/* Sidebar - Desktop (Static) / Mobile (Slide-over) */}
      <motion.aside
        initial={false}
        animate={{
          x: (isMobile && !sidebarOpen) ? "-100%" : 0,
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-background lg:static lg:!translate-x-0 ${isMobile ? 'shadow-2xl' : ''}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Link href="/" prefetch={true} className="flex items-center gap-2">
            {settings?.schoolLogo ? (
              <img src={settings.schoolLogo} alt="Logo" className="h-[40px] w-[40px] rounded object-contain" />
            ) : (
              <Image src="/images/logo.png" alt="Logo" width={60} height={60} className="h-[60px] w-[60px] object-contain" />
            )}
            <div>
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
                      {typeof item.icon === 'string' ? (
                        (() => {
                          const IconComp = IconMap[item.icon] || Icons.HelpCircle;
                          return <IconComp className="h-[18px] w-[18px]" />;
                        })()
                      ) : (
                        <item.icon className="h-[18px] w-[18px]" />
                      )}
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

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 bg-secondary">
        {/* Top Bar */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:px-6 shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button className={`${isMobile ? 'hidden' : 'text-foreground lg:hidden'}`} onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="lg:hidden">
              <img src={settings?.schoolLogo || "/images/logo.png"} alt="Logo" className="h-8 w-8 object-contain" />
            </Link>
            {/* Breadcrumb - Only desktop or large mobile */}
            <nav className="hidden items-center gap-1 text-sm sm:flex" aria-label="Breadcrumb">
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
            {/* Mobile Title */}
            <span className="text-sm font-bold capitalize text-primary sm:hidden truncate max-w-[150px]">
              {breadcrumbs[breadcrumbs.length - 1]?.replace(/-/g, " ") || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Tool */}
            <div className="relative">
              <div className={`${isSearchVisible ? 'fixed inset-x-0 top-0 h-14 z-[60] bg-background flex items-center px-4' : 'hidden md:block'}`}>
                <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground md:left-3" />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      window.location.href = `${portalBase}/search?q=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                  className="w-full md:w-auto"
                >
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-full pl-9 text-xs transition-all focus:ring-primary md:w-40 md:focus:w-48 lg:w-64"
                    autoFocus={isSearchVisible}
                  />
                </form>
                {isSearchVisible && (
                  <Button variant="ghost" size="icon" className="ml-2" onClick={() => setIsSearchVisible(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 md:hidden"
                onClick={() => setIsSearchVisible(true)}
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" />
              </Button>
            </div>

            {/* Notifications Icon (Mobile Header) */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="h-[18px] w-[18px]" />
                {notifications.length > 0 && (
                  <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                )}
              </Button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <div className="fixed inset-0 z-[70] md:absolute md:inset-auto md:right-0 md:top-full md:mt-2">
                    <div className="fixed inset-0 bg-transparent" onClick={() => setIsNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="relative z-10 w-full md:w-80 h-full md:h-auto md:rounded-xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col pt-14 md:pt-0"
                    >
                      <div className="bg-muted/30 p-4 border-b border-border flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase text-muted-foreground">Recent Notifications</h3>
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsNotificationsOpen(false)}><X size={16} /></Button>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {Array.isArray(notifications) && notifications.length > 0 ? (
                          notifications.map((n: any, i: number) => (
                            <div key={n.id || i} className="p-4 border-b border-border hover:bg-muted/50">
                              <p className="text-sm font-semibold">{n.title || "Announcement"}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {n.createdAt && !isNaN(new Date(n.createdAt).getTime()) 
                                  ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })
                                  : 'Recently'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.content || ""}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-12 text-center opacity-30">
                            <Bell className="h-12 w-12 mx-auto mb-2" />
                            <p className="text-sm">No notifications</p>
                          </div>
                        )}
                      </div>
                      <Link
                        href={`${portalBase}/announcements`}
                        className="p-4 text-center text-xs font-bold text-primary border-t border-border bg-muted/10"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        View All Announcements
                      </Link>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Icon */}
            <Link href={`${portalBase}/profile`}>
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={userImage} />
                <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>

            {/* Desktop Logout Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-9 w-9 text-muted-foreground transition-colors hover:text-destructive"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </Button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className={`flex-1 overflow-y-auto p-4 pb-0 lg:p-6 lg:pb-0 scroll-smooth ${isMobile ? 'pb-24' : ''}`} style={{ WebkitOverflowScrolling: "touch" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0.15 : 0.3, ease: "easeOut" }}
            className="pb-8"
          >
            {children}
          </motion.div>
        </main>

        {/* Mobile Bottom Navigation - Sticky at bottom */}
        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-t border-border flex items-center justify-between px-2 pb-safe pt-2">
            <BottomNavLink href={portalBase} active={safePathname === portalBase} icon={LayoutDashboard} label="Home" />
            <BottomNavLink href={`${portalBase}/announcements`} active={safePathname.includes('/announcements')} icon={Megaphone} label="Alerts" />
            <div className="flex flex-col items-center justify-center flex-1 py-1" onClick={() => setSidebarOpen(true)}>
              <div className="h-11 w-11 flex items-center justify-center rounded-2xl bg-primary shadow-burgundy-glow/20 text-white">
                <Menu size={22} />
              </div>
              <span className="text-[10px] mt-1 font-bold text-primary uppercase">More</span>
            </div>
            <BottomNavLink href={`${portalBase}/profile`} active={safePathname.includes('/profile')} icon={User} label="Profile" />
            <button onClick={handleLogout} className="flex flex-col items-center justify-center flex-1 py-1 text-muted-foreground">
              <LogOut size={20} />
              <span className="text-[10px] mt-1 font-medium">Exit</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}

function BottomNavLink({ href, icon: Icon, label, active }: { href: string, icon: LucideIcon, label: string, active: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${active ? 'text-primary' : 'text-muted-foreground opacity-70'}`}>
      <Icon size={active ? 22 : 20} strokeWidth={active ? 2.5 : 2} />
      <span className={`text-[10px] mt-1 font-bold uppercase tracking-tight ${active ? 'visible' : 'visible'}`}>{label}</span>
      {active && <div className="mt-1 h-1 w-1 rounded-full bg-primary" />}
    </Link>
  )
}

export default AppLayout
