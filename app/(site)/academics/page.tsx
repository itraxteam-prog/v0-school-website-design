import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { FacultySection } from "@/components/public/faculty-section"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, GraduationCap, Award, Users, Mic2, LayoutGrid, Trophy, Palette, Dribbble } from "lucide-react"

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
    image: "/images/ceo.jpg",
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
      <section className="bg-background py-16 md:py-28 overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <AnimatedWrapper direction="up" className="mb-16 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.4em] text-primary">Academic Excellence</p>
            <h2 className="heading-1 font-serif text-foreground">Academic Year <span className="text-burgundy-gradient">&</span> Assessments</h2>
          </AnimatedWrapper>

          <div className="relative">
            {/* Roadmap Line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-primary/10 hidden lg:block -translate-y-1/2" />

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 relative z-10">
              {/* Year Roadmap */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-0.5 w-12 bg-burgundy-gradient rounded-full" />
                  <h3 className="text-lg font-serif font-bold text-primary italic">The Academic Cycle</h3>
                </div>
                <div className="grid gap-6">
                  <AnimatedWrapper direction="left" className="group">
                    <div className="glass-panel p-8 rounded-[2rem] border-primary/5 hover:border-primary/20 transition-all hover:shadow-2xl bg-secondary/20 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-burgundy-gradient" />
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Phase One</span>
                        <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-tighter italic">March - July</span>
                      </div>
                      <h4 className="heading-3 mb-2 font-serif">1st Term</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Foundation phase focusing on core competencies and primary term milestones.</p>
                    </div>
                  </AnimatedWrapper>

                  <AnimatedWrapper direction="left" delay={0.1} className="group">
                    <div className="glass-panel p-8 rounded-[2rem] border-primary/5 hover:border-primary/20 transition-all hover:shadow-2xl bg-secondary/20 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-burgundy-gradient" />
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Phase Two</span>
                        <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-tighter italic">August - December</span>
                      </div>
                      <h4 className="heading-3 mb-2 font-serif">2nd Term</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Consolidation and final evaluations phase, leading to end-of-year results.</p>
                    </div>
                  </AnimatedWrapper>
                </div>
              </div>

              {/* Assessment Roadmap */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-0.5 w-12 bg-burgundy-gradient rounded-full" />
                  <h3 className="text-lg font-serif font-bold text-primary italic">Evaluation Milestones</h3>
                </div>
                <div className="grid gap-4">
                  {[
                    { title: "Admission Tests", desc: "Evaluating readiness for initial enrollment." },
                    { title: "Informal Assessments", desc: "Continuous monitoring of progress throughout the year." },
                    { title: "First Term Examination", desc: "Summative evaluation of first half curriculum." },
                    { title: "Second Term Examination", desc: "Final examination covering the complete academic scope." }
                  ].map((item, i) => (
                    <AnimatedWrapper key={item.title} direction="right" delay={i * 0.1}>
                      <div className="flex items-start gap-6 group hover:translate-x-2 transition-transform">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-burgundy-glow text-white shadow-lg group-hover:scale-110 transition-transform">
                          <span className="text-xs font-bold">{i + 1}</span>
                        </div>
                        <div className="pt-1">
                          <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.desc}</p>
                        </div>
                      </div>
                    </AnimatedWrapper>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extracurriculars */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <AnimatedWrapper direction="up" className="mb-16 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Beyond the Classroom</p>
            <h2 className="heading-2 font-serif text-primary">Extracurricular Activities</h2>
          </AnimatedWrapper>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: "Debate", image: "/images/activities/debate.jpg" },
              { name: "Scrabble", image: "/images/activities/scrabble.jpg" },
              { name: "Chess", image: "/images/activities/chess.jpg" },
              { name: "Arts", image: "/images/activities/arts.jpg" },
              { name: "Sports", image: "/images/activities/sports.jpg" },
            ].map((activity, i) => (
              <AnimatedWrapper key={activity.name} delay={i * 0.1} className="h-full">
                <Card className="glass-card group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-none h-full bg-background/50 overflow-hidden">
                  <div className="aspect-square w-full bg-muted flex items-center justify-center relative overflow-hidden">
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  </div>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm font-bold tracking-wider text-muted-foreground group-hover:text-primary transition-colors uppercase">
                      {activity.name}
                    </p>
                  </CardContent>
                </Card>
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
