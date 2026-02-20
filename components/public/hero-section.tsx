"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { useAuth } from "@/context/AuthContext"

export function HeroSection() {
  const { user } = useAuth()
  const portalHref = user ? `/portal/${user.role}` : "/portal/login"
  const portalLabel = "Login"

  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-foreground lg:min-h-[80vh]">
      {/* Background overlay pattern */}
      <div className="absolute inset-0 bg-burgundy-gradient opacity-90" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div className="max-w-2xl">
          <AnimatedWrapper direction="down" delay={0.1}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              The Institute for Quality Education
            </p>
          </AnimatedWrapper>

          <AnimatedWrapper direction="up" delay={0.2}>
            <h1 className="heading-1 mb-6 text-balance text-white leading-tight">
              Shaping <span className="text-white/80">Tomorrow&apos;s</span> <br /> Leaders Today
            </h1>
          </AnimatedWrapper>

          <AnimatedWrapper direction="up" delay={0.3}>
            <p className="mb-8 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              The Pioneers High School is a premier K-12 academic institution committed
              to academic excellence, discipline, and holistic student development.
            </p>
          </AnimatedWrapper>

          <AnimatedWrapper direction="up" delay={0.4}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/admissions">
                <Button
                  size="lg"
                  className="w-full bg-white text-primary font-bold hover:bg-white/90 sm:w-auto shadow-xl"
                >
                  Apply for Admission
                </Button>
              </Link>
              <Link href={portalHref}>
                <Button
                  size="lg"
                  className="w-full bg-white text-primary font-bold hover:bg-white/90 sm:w-auto shadow-xl"
                >
                  {portalLabel}
                </Button>
              </Link>
            </div>
          </AnimatedWrapper>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 right-0 hidden h-full w-1/3 lg:block">
        <div className="flex h-full items-center justify-center">
          <div className="h-64 w-64 rounded-full border border-primary-foreground/10 opacity-30" />
          <div className="absolute h-48 w-48 rounded-full border border-primary/30 opacity-20" />
        </div>
      </div>
    </section>
  )
}
