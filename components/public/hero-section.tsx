"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function HeroSection() {
  const ref = useScrollAnimation()

  return (
    <section ref={ref} className="relative flex min-h-[70vh] items-center overflow-hidden bg-foreground lg:min-h-[80vh]">
      {/* Background overlay pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(345,100%,25%,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0,0%,10%,0.95),hsl(0,0%,10%,0.7))]" />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div className="max-w-2xl">
          <div className="animate-on-scroll">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/50">
              The Institute for Quality Education
            </p>
          </div>
          <h1 className="animate-on-scroll heading-1 mb-6 text-balance text-primary-foreground">
            Shaping Tomorrow&apos;s Leaders Today
          </h1>
          <p className="animate-on-scroll mb-8 max-w-xl text-base leading-relaxed text-primary-foreground/70 md:text-lg">
            The Pioneers High School is a premier K-12 academic institution committed
            to academic excellence, discipline, and holistic student development.
          </p>
          <div className="animate-on-scroll flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/admissions">
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
              >
                Apply for Admission
              </Button>
            </Link>
            <Link href="/portal/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-primary-foreground/30 text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
              >
                Login Portal
              </Button>
            </Link>
          </div>
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
