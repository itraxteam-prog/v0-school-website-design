"use client"

import { useState } from "react"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { FacultyModal } from "@/components/ui/faculty-modal"
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
  {
    name: "Mr. Usman Sheikh",
    designation: "Head of Mathematics",
    qualifications: "M.Sc. Mathematics, B.Ed.",
    specialization: "Calculus & Pure Mathematics",
    bio: "Dedicated to making complex mathematical concepts accessible through interactive problem-solving techniques."
  },
  {
    name: "Dr. Ayesha Siddiqui",
    designation: "Senior Physics Faculty",
    qualifications: "Ph.D. Physics",
    specialization: "Quantum Mechanics",
    bio: "Passionate about research-led teaching and inspiring the next generation of experimental physicists."
  },
  {
    name: "Ms. Nadia Jamil",
    designation: "Department Head, English",
    qualifications: "M.A. English Literature",
    specialization: "Contemporary Literature",
    bio: "Focused on developing critical thinking and expressive writing skills in high school students."
  },
  {
    name: "Mr. Bilal Ahmed",
    designation: "ICT Coordinator",
    qualifications: "M.S. Computer Science",
    specialization: "Software Architecture",
    bio: "Teaching technology not just as a tool, but as a medium for creative problem-solving."
  },
  {
    name: "Dr. Zainab Rizvi",
    designation: "Chemistry Specialist",
    qualifications: "Ph.D. Chemistry",
    specialization: "Organic Chemistry",
    bio: "Creating laboratory experiences that bring theoretical chemistry to life for every student."
  },
  {
    name: "Ms. Hira Farooq",
    designation: "Biology Faculty",
    qualifications: "M.Phil. Microbiology",
    specialization: "Genetics",
    bio: "Exploring the wonders of the natural world through hands-on biological studies and research."
  },
]

function AcademicsContent() {
  const [selectedMember, setSelectedMember] = useState<any>(null)

  return (
    <div>
      {/* Hero */}
      <section className="bg-foreground py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-burgundy-gradient opacity-90" />
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 relative z-10">
          <AnimatedWrapper direction="down" className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50">Academics</p>
            <h1 className="heading-1 mb-4 text-balance text-white">Curriculum & <br />Programs</h1>
            <p className="text-base leading-relaxed text-white/80 md:text-lg">
              Our rigorous academic programs are designed to challenge students intellectually while nurturing their individual strengths.
            </p>
          </AnimatedWrapper>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {highlights.map((h, i) => (
              <AnimatedWrapper key={h.title} delay={i * 0.1}>
                <Card className="glass-card h-full border-none">
                  <CardContent className="flex flex-col gap-4 p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-burgundy-gradient text-white shadow-lg">
                      <h.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="heading-3 mb-2">{h.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground/80">{h.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Levels */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <AnimatedWrapper direction="up" className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Detailed Pathways</p>
            <h2 className="heading-2">Programs by Grade Level</h2>
          </AnimatedWrapper>
          <div className="grid gap-6">
            {gradeLevels.map((grade, i) => (
              <AnimatedWrapper key={grade.level} delay={i * 0.1} direction="right">
                <Card className="glass-panel border-none">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="heading-3 text-burgundy-gradient mb-3">{grade.level}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl">{grade.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 md:max-w-xs justify-end">
                        {grade.subjects.map((subject) => (
                          <Badge key={subject} variant="outline" className="border-primary/20 text-primary bg-white/50 text-xs py-1">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <AnimatedWrapper direction="up" className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Our Educators</p>
            <h2 className="heading-2">Faculty Spotlight</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Click on a faculty member to view their complete professional profile.</p>
          </AnimatedWrapper>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {faculty.map((f, i) => (
              <AnimatedWrapper key={f.name} delay={i * 0.1}>
                <Card
                  className="glass-card border-none cursor-pointer group"
                  onClick={() => setSelectedMember(f)}
                >
                  <CardContent className="flex items-center gap-5 p-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-muted overflow-hidden border border-white/20 group-hover:scale-105 transition-transform">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Photo</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">{f.name}</h3>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 mt-1">{f.designation}</p>
                      <p className="text-xs text-muted-foreground font-medium line-clamp-1">{f.qualifications}</p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedWrapper>
            ))}
          </div>
        </div>
      </section>

      <FacultyModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
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
