"use client"

import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Heart } from "lucide-react"

const timeline = [
  { year: "1995", title: "Foundation", description: "The Pioneers High School was established with a vision for quality education." },
  { year: "2002", title: "Cambridge Affiliation", description: "Became an affiliated Cambridge Assessment International Education center." },
  { year: "2010", title: "Campus Expansion", description: "Opened new state-of-the-art science labs, library, and sports complex." },
  { year: "2018", title: "Digital Transformation", description: "Introduced smart classrooms and integrated digital learning platforms." },
  { year: "2024", title: "Regional Excellence", description: "Recognized as a top-performing institution in the region." },
]

const leaders = [
  { name: "Dr. Ahmad Raza", role: "Principal", department: "Administration" },
  { name: "Ms. Fatima Khan", role: "Vice Principal", department: "Academics" },
  { name: "Mr. Hassan Ali", role: "Head of Sciences", department: "STEM" },
  { name: "Ms. Sarah Malik", role: "Head of Humanities", department: "Arts" },
]

const values = [
  { icon: Target, title: "Our Mission", description: "To provide a rigorous academic environment that fosters intellectual curiosity, moral integrity, and leadership skills in every student." },
  { icon: Eye, title: "Our Vision", description: "To be the leading educational institution that shapes global citizens rooted in strong values and equipped for the challenges of tomorrow." },
  { icon: Heart, title: "Our Values", description: "Excellence, Discipline, Integrity, Innovation, and Community. These core values guide everything we do at The Pioneers High School." },
]

function AboutContent() {
  const ref = useScrollAnimation()

  return (
    <div ref={ref}>
      {/* Hero */}
      <section className="bg-foreground py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="animate-on-scroll max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/50">About Us</p>
            <h1 className="heading-1 mb-4 text-balance text-primary-foreground">Our Story of Excellence</h1>
            <p className="text-base leading-relaxed text-primary-foreground/70 md:text-lg">
              Since 1995, The Pioneers High School has been shaping young minds through quality education, discipline, and a passion for lifelong learning.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <Card key={v.title} className="animate-on-scroll border-border" style={{ transitionDelay: `${i * 100}ms` }}>
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-card-foreground">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="animate-on-scroll mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Our Journey</p>
            <h2 className="heading-2 text-foreground">School History</h2>
          </div>
          <div className="relative mx-auto max-w-2xl">
            {/* Line */}
            <div className="absolute left-4 top-0 hidden h-full w-px bg-border md:left-1/2 md:block" />
            <div className="flex flex-col gap-8">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className="animate-on-scroll relative flex flex-col gap-2 pl-10 md:flex-row md:items-start md:pl-0"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {/* Dot */}
                  <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-primary bg-background md:left-1/2 md:-translate-x-1/2" />
                  {/* Content */}
                  <div className={`md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12"}`}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">{item.year}</p>
                    <h3 className="font-serif text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="animate-on-scroll mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Leadership</p>
            <h2 className="heading-2 text-foreground">Our Team</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((leader, i) => (
              <Card key={leader.name} className="animate-on-scroll border-border text-center" style={{ transitionDelay: `${i * 80}ms` }}>
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <span className="text-xs text-muted-foreground">Photo</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-card-foreground">{leader.name}</h3>
                    <p className="text-sm text-primary">{leader.role}</p>
                    <p className="text-xs text-muted-foreground">{leader.department}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main><AboutContent /></main>
      <Footer />
    </>
  )
}
