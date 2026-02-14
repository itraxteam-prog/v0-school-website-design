import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/academics", label: "Academics" },
  { href: "/admissions", label: "Admissions" },
  { href: "/contact", label: "Contact" },
]

const portalLinks = [
  { href: "/portal/login", label: "Student Portal" },
  { href: "/portal/login", label: "Teacher Portal" },
  { href: "/portal/login", label: "Admin Portal" },
]

const socialLinks = [
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Youtube, label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="bg-burgundy-glow text-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 lg:px-8 relative z-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="The Pioneers High School Logo"
                width={64}
                height={64}
                className="h-16 w-16 object-contain"
              />
              <div>
                <p className="font-serif text-sm font-bold text-background">
                  The Pioneers High School
                </p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-background/60">
                  Quality Education
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-background/70">
              Empowering young minds with academic excellence, discipline, and holistic development since 1995.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-background/50">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-background/50">
              Portals
            </h3>
            <ul className="flex flex-col gap-2">
              {portalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-background/50">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2 text-sm text-background/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>123 Education Avenue, Academic City</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@pioneershigh.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-background/10" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-background/50">
            &copy; {new Date().getFullYear()} The Pioneers High School. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background/70 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
