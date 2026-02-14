"use client"

import { CountUp } from "@/components/public/count-up"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const stats = [
  { value: 28, suffix: "+", label: "Years of Excellence" },
  { value: 15, suffix: ":1", label: "Student-Teacher Ratio" },
  { value: 98, suffix: "%", label: "Graduation Rate" },
  { value: 85, suffix: "%", label: "University Placements" },
]

export function StatsSection() {
  const ref = useScrollAnimation()

  return (
    <section ref={ref} className="bg-foreground py-16 md:py-20">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="animate-on-scroll text-center"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <p className="font-serif text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-primary-foreground/50 md:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
