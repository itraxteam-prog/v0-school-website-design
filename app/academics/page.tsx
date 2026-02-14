"use client"

import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, GraduationCap, Award, Users } from "lucide-react"

const gradeLevels = [
  {
    level: "Primary (Grade 1-5)",
    description: "Foundation years focusing on literacy, numeracy, and character building with a play-based learning approach.",
    subjects: ["English", "Mathematics", "Science", "Urdu", "Islamiat", "Art", "Physical Education"],
  },
  {
    level: "Middle (Grade 6-8)",
    description: "Transition years introducing specialized subjects and developing critical thinking skills.",
    subjects: ["English", "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "History", "Geography"],
  },
  {
    level: "O-Level (Grade 9-10)",
    description: "Cambridge International curriculum preparing students for globally recognized qualifications.",
    subjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Urdu", "Islamiat"],
  },
  {
    level: "A-Level (Grade 11-12)",
    description: "Advanced level studies with specialized subject streams for university preparation.",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Economics", "Business Studies", "Accounting"],
  },
]

const highlights = [
  { icon: BookOpen, title: "Cambridge Certified", description: "Internationally recognized O-Level and A-Level programs." },
  { icon: GraduationCap, title: "Expert Faculty", description: "Highly qualified teachers with advanced degrees and years of experience." },
  { icon: Award, title: "Top Results", description: "Consistently among the highest-performing schools in the region." },
  { icon: Users, title: "Small Class Sizes", description: "15:1 student-teacher ratio ensuring personalized attention." },
]

const faculty = [
  { name: "Mr. Usman Sheikh", subject: "Mathematics", qualification: "M.Sc. Mathematics" },
  { name: "Dr. Ayesha Siddiqui", subject: "Physics", qualification: "Ph.D. Physics" },
  { name: "Ms. Nadia Jamil", subject: "English", qualification: "M.A. English Literature" },
  { name: "Mr. Bilal Ahmed", subject: "Computer Science", qualification: "M.S. Computer Science" },
  { name: "Dr. Zainab Rizvi", subject: "Chemistry", qualification: "Ph.D. Chemistry" },
  { name: "Ms. Hira Farooq", subject: "Biology", qualification: "M.Phil. Microbiology" },
]

function AcademicsContent() {
  const ref = useScrollAnimation()

  return (
    <div ref={ref}>
      {/* Hero */}
      <section className="bg-foreground py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="animate-on-scroll max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/50">Academics</p>
            <h1 className="heading-1 mb-4 text-balance text-primary-foreground">Curriculum & Programs</h1>
            <p className="text-base leading-relaxed text-primary-foreground/70 md:text-lg">
              Our rigorous academic programs are designed to challenge students intellectually while nurturing their individual strengths.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {highlights.map((h, i) => (
              <Card key={h.title} className="animate-on-scroll border-border" style={{ transitionDelay: `${i * 80}ms` }}>
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
                    <h.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-base font-semibold text-card-foreground">{h.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{h.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Levels */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="animate-on-scroll mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Programs</p>
            <h2 className="heading-2 text-foreground">Programs by Grade Level</h2>
          </div>
          <div className="flex flex-col gap-6">
            {gradeLevels.map((grade, i) => (
              <Card key={grade.level} className="animate-on-scroll border-border" style={{ transitionDelay: `${i * 100}ms` }}>
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-semibold text-card-foreground">{grade.level}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{grade.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {grade.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="animate-on-scroll mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Our Educators</p>
            <h2 className="heading-2 text-foreground">Faculty Overview</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {faculty.map((f, i) => (
              <Card key={f.name} className="animate-on-scroll border-border" style={{ transitionDelay: `${i * 80}ms` }}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                    <span className="text-[10px] text-muted-foreground">Photo</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground">{f.name}</h3>
                    <p className="text-sm text-primary">{f.subject}</p>
                    <p className="text-xs text-muted-foreground">{f.qualification}</p>
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

export default function AcademicsPage() {
  return (
    <>
      <Navbar />
      <main><AcademicsContent /></main>
      <Footer />
    </>
  )
}
