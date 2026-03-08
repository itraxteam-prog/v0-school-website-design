import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { FacultySection } from "@/components/public/faculty-section"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, GraduationCap, Award, Users } from "lucide-react"

const gradeLevels = [
  {
    level: "Primary (Grade 1-5)",
    description: "Foundation years focusing on literacy, numeracy, and character building. We emphasize 'Active Learning through real experience' with a play-based approach.",
    subjects: ["English", "Mathematics", "Science", "Urdu", "Islamiat", "Art", "Physical Education"],
  },
  {
    level: "Middle (Grade 6-8)",
    description: "Transition years introducing specialized subjects and developing critical thinking skills through active engagement.",
    subjects: ["English", "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "History", "Geography"],
  },
  {
    level: "High (Grade 9-10)",
    description: "Cambridge International curriculum preparing students for globally recognized qualifications. Focus on research and application.",
    subjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Urdu", "Islamiat"],
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
    name: "Mr. Muhammad Asif Shahyan",
    designation: "CEO of The Pioneers High School",
    qualifications: "Masters in Political Science",
    specialization: "Leadership & Administration",
    bio: "Driving the vision and strategic direction of The Pioneers High School."
  },
  {
    name: "Ms. Saeeda Sahar",
    designation: "Principal of The Pioneers High School",
    qualifications: "B. Ed",
    specialization: "Educational Administration",
    bio: "Dedicated to fostering a supportive and rigorous academic environment for all students."
  },
]

function AcademicsContent() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0a0a0a] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-burgundy-gradient opacity-90" />
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 relative z-10">
          <AnimatedWrapper direction="down" className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50">Academics</p>
            <h1 className="heading-1 mb-4 text-balance text-white">Curriculum & <br />Programs</h1>
            <p className="text-base leading-relaxed text-white/80 md:text-lg">
              Our rigorous academic programs are designed to challenge students intellectually while nurturing their individual strengths.
            </p>
            <AnimatedWrapper direction="up" delay={0.2} className="mt-8">
              <a
                href="/prospectus.pdf"
                download
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:bg-white/90 shadow-xl"
              >
                <BookOpen className="h-4 w-4" />
                Download Official Prospectus
              </a>
            </AnimatedWrapper>
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
                          <Badge key={subject} variant="outline" className="border-primary/20 text-primary bg-background/50 text-xs py-1">
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

      {/* Academic Year & Assessments */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <AnimatedWrapper direction="left">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Academic Structure</p>
              <h2 className="heading-2 mb-6">Academic Year & Assessments</h2>
              <p className="text-base leading-relaxed text-muted-foreground/80 mb-8">
                The academic year is structured into two comprehensive terms to ensure balanced learning and thorough evaluation of student progress.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-secondary/50 p-6 border border-primary/5">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">1st Term</h4>
                  <p className="text-sm text-muted-foreground">March to July</p>
                </div>
                <div className="rounded-2xl bg-secondary/50 p-6 border border-primary/5">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">2nd Term</h4>
                  <p className="text-sm text-muted-foreground">August to December</p>
                </div>
              </div>
            </AnimatedWrapper>
            <AnimatedWrapper direction="right">
              <Card className="glass-card border-none overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-burgundy-gradient p-6 text-white text-center">
                    <h3 className="heading-3">Assessment System</h3>
                  </div>
                  <div className="p-8 grid gap-4">
                    {[
                      "Admission Tests",
                      "Informal Assessments",
                      "First Term Examination",
                      "Second Term Examination"
                    ].map((item, i) => (
                      <div key={item} className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {i + 1}
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedWrapper>
          </div>
        </div>
      </section>

      {/* Extracurriculars */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 text-center">
          <AnimatedWrapper direction="up" className="mb-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Beyond the Classroom</p>
            <h2 className="heading-2">Extracurricular Activities</h2>
          </AnimatedWrapper>
          <div className="flex flex-wrap justify-center gap-4">
            {["Debate", "Scrabble", "Chess", "Arts", "Sports"].map((activity) => (
              <AnimatedWrapper key={activity} className="px-6 py-3 rounded-2xl bg-background shadow-sm border border-primary/5 text-sm font-bold text-primary">
                {activity}
              </AnimatedWrapper>
            ))}
          </div>
        </div>
      </section>

      <FacultySection faculty={faculty} />
    </div>
  )
}

export default function AcademicsPage() {
  return <AcademicsContent />
}
