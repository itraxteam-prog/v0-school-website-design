"use client"

import { BookOpen, FlaskConical, Palette, Trophy, Code, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const programs = [
  {
    icon: BookOpen,
    title: "Cambridge Curriculum",
    description:
      "Internationally recognized O-Level and A-Level programs with exceptional pass rates.",
  },
  {
    icon: FlaskConical,
    title: "STEM Excellence",
    description:
      "Advanced science and mathematics programs with state-of-the-art laboratory facilities.",
  },
  {
    icon: Palette,
    title: "Arts & Humanities",
    description:
      "Comprehensive arts program nurturing creative expression and critical thinking.",
  },
  {
    icon: Trophy,
    title: "Sports Academy",
    description:
      "Professional coaching in cricket, football, basketball, and athletics.",
  },
  {
    icon: Code,
    title: "Digital Literacy",
    description:
      "Modern computer science curriculum including programming, robotics, and AI fundamentals.",
  },
  {
    icon: Globe,
    title: "Languages",
    description:
      "English, Urdu, Arabic, and French language programs with native-level proficiency goals.",
  },
]

export function ProgramsSection() {
  const ref = useScrollAnimation()

  return (
    <section ref={ref} className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div className="animate-on-scroll mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            What We Offer
          </p>
          <h2 className="heading-2 text-balance text-foreground">
            Academic Programs
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
            Our diverse curriculum is designed to prepare students for global success
            while grounding them in strong values.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {programs.map((program, i) => (
            <Card
              key={program.title}
              className="animate-on-scroll group cursor-default border-border bg-card transition-all duration-200 hover:border-primary/20 hover:shadow-md"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                  <program.icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-card-foreground">
                  {program.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {program.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
