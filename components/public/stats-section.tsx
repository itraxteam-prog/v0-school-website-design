"use client"

import { CountUp } from "@/components/public/count-up"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"

const stats = [
  { value: 28, suffix: "+", label: "Years of Excellence" },
  { value: 15, suffix: ":1", label: "Student-Teacher Ratio" },
  { value: 98, suffix: "%", label: "Graduation Rate" },
  { value: 85, suffix: "%", label: "University Placements" },
]

export function StatsSection() {
  return (
    <section className="bg-burgundy-glow py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <AnimatedWrapper
              key={stat.label}
              delay={i * 0.1}
              className="text-center"
            >
              <p className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl drop-shadow-lg">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 text-xs font-bold uppercase tracking-widest text-white/60 md:text-sm">
                {stat.label}
              </p>
            </AnimatedWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
