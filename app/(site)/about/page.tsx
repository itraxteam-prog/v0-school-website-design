import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Heart } from "lucide-react"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"

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
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0a0a0a] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-burgundy-gradient opacity-90" />
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 relative z-10">
          <AnimatedWrapper direction="down" className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50">Our Heritage</p>
            <h1 className="heading-1 mb-4 text-balance text-white">Our Story of Excellence</h1>
            <p className="text-base leading-relaxed text-white/80 md:text-lg">
              Since 1995, The Pioneers High School has been shaping young minds through quality education, discipline, and a passion for lifelong learning.
            </p>
          </AnimatedWrapper>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((v, i) => (
              <AnimatedWrapper key={v.title} delay={i * 0.1}>
                <Card className="glass-card h-full border-none">
                  <CardContent className="flex flex-col gap-4 p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-burgundy-gradient text-white shadow-lg">
                      <v.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="heading-3 mb-3">{v.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground/80">{v.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-secondary/30 py-16 md:py-24 overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <AnimatedWrapper direction="up" className="mb-16 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">The Evolution</p>
            <h2 className="heading-2">School Milestones</h2>
          </AnimatedWrapper>
          <div className="relative mx-auto max-w-4xl">
            {/* Line */}
            <div className="absolute left-4 top-0 hidden h-full w-px bg-primary/20 md:left-1/2 md:block" />
            <div className="flex flex-col gap-12">
              {timeline.map((item, i) => (
                <AnimatedWrapper
                  key={item.year}
                  direction={i % 2 === 0 ? "left" : "right"}
                  delay={i * 0.1}
                  className={`relative flex flex-col gap-2 pl-10 md:flex-row md:items-start md:pl-0`}
                >
                  {/* Dot */}
                  <div className="absolute left-2.5 top-1 h-4 w-4 rounded-full border-4 border-background bg-primary shadow-lg md:left-1/2 md:-translate-x-1/2 md:top-6" />
                  {/* Content */}
                  <div className={`md:w-1/2 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:ml-auto md:pl-16"}`}>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">{item.year}</span>
                    <h3 className="heading-3 mb-2">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground font-medium">{item.description}</p>
                  </div>
                </AnimatedWrapper>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <AnimatedWrapper direction="up" className="mb-16 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Visionaries</p>
            <h2 className="heading-2">Our Leadership Team</h2>
          </AnimatedWrapper>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((leader, i) => (
              <AnimatedWrapper key={leader.name} delay={i * 0.1}>
                <Card className="glass-card border-none text-center h-full group">
                  <CardContent className="flex flex-col items-center gap-4 p-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted overflow-hidden border border-white/20 shadow-inner group-hover:scale-105 transition-transform">
                      <span className="text-xs text-muted-foreground uppercase font-bold">Photo</span>
                    </div>
                    <div>
                      <h3 className="heading-3 mb-1">{leader.name}</h3>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{leader.role}</p>
                      <p className="text-xs text-muted-foreground font-semibold">{leader.department}</p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedWrapper>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default function AboutPage() {
  return <AboutContent />
}
