"use client"

import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardCheck, FileText, UserCheck, CalendarDays } from "lucide-react"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"

const steps = [
  { icon: FileText, step: "01", title: "Submit Application", description: "Fill out the online inquiry form or collect an application from our admissions office." },
  { icon: ClipboardCheck, step: "02", title: "Entrance Assessment", description: "Students take a placement test to evaluate academic readiness for the appropriate grade level." },
  { icon: UserCheck, step: "03", title: "Interview", description: "A brief interview with the student and parents to understand goals and expectations." },
  { icon: CalendarDays, step: "04", title: "Enrollment", description: "Upon acceptance, complete enrollment documentation and fee submission to secure the seat." },
]

const fees = [
  { level: "Primary (Grade 1-5)", admission: "25,000", monthly: "8,500", annual: "85,000" },
  { level: "Middle (Grade 6-8)", admission: "30,000", monthly: "10,000", annual: "100,000" },
  { level: "O-Level (Grade 9-10)", admission: "35,000", monthly: "14,000", annual: "140,000" },
  { level: "A-Level (Grade 11-12)", admission: "40,000", monthly: "18,000", annual: "180,000" },
]

const dates = [
  { event: "Admissions Open", date: "January 15, 2026" },
  { event: "Entrance Test", date: "February 20, 2026" },
  { event: "Interview Week", date: "March 1 - 7, 2026" },
  { event: "Results Announcement", date: "March 15, 2026" },
  { event: "Enrollment Deadline", date: "April 1, 2026" },
]

function AdmissionsContent() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-foreground py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-burgundy-gradient opacity-90" />
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 relative z-10">
          <AnimatedWrapper direction="down" className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50">Admissions 2026</p>
            <h1 className="heading-1 mb-4 text-balance text-white font-serif">Join Our Community</h1>
            <p className="text-base leading-relaxed text-white/80 md:text-lg">
              Begin your journey at The Pioneers High School. We welcome students who are eager to learn, grow, and excel.
            </p>
          </AnimatedWrapper>
        </div>
      </section>

      {/* Admission Steps */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <AnimatedWrapper direction="up" className="mb-16 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">The Pathway</p>
            <h2 className="heading-2">Admission Process</h2>
          </AnimatedWrapper>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <AnimatedWrapper key={s.step} delay={i * 0.1} className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-burgundy-glow text-white shadow-xl transition-transform group-hover:scale-110">
                  <s.icon className="h-8 w-8" />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">{s.step}</p>
                <h3 className="mt-2 heading-3">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground/80 font-medium">{s.description}</p>
              </AnimatedWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <AnimatedWrapper direction="up" className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Investment</p>
            <h2 className="heading-2">Fee Structure</h2>
          </AnimatedWrapper>
          <AnimatedWrapper direction="up" delay={0.2} className="overflow-hidden rounded-2xl border-none shadow-2xl glass-panel">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="bg-burgundy-gradient text-white">
                    <th className="px-6 py-4 font-bold uppercase tracking-wider">Grade Level</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider">Admission (PKR)</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider">Monthly (PKR)</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider">Annual (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  {fees.map((f, i) => (
                    <tr key={f.level} className="transition-colors hover:bg-primary/5">
                      <td className="px-6 py-4 font-bold text-foreground">{f.level}</td>
                      <td className="px-6 py-4 text-muted-foreground font-medium">{f.admission}</td>
                      <td className="px-6 py-4 text-muted-foreground font-medium">{f.monthly}</td>
                      <td className="px-6 py-4 text-muted-foreground font-medium">{f.annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedWrapper>
        </div>
      </section>

      {/* Important Dates & Inquiry */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            {/* Dates */}
            <div>
              <AnimatedWrapper direction="left" className="mb-10">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Important</p>
                <h2 className="heading-2 mb-4">Calendar & Deadline</h2>
                <p className="text-muted-foreground font-medium">Please track these dates carefully to ensure timely admission processing.</p>
              </AnimatedWrapper>
              <div className="flex flex-col gap-5">
                {dates.map((d, i) => (
                  <AnimatedWrapper key={d.event} direction="left" delay={i * 0.1} className="flex items-center gap-5 rounded-xl border border-primary/5 bg-secondary/20 p-5 group hover:bg-secondary/40 transition-colors">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{d.event}</p>
                      <p className="text-xs text-muted-foreground font-bold mt-1 uppercase tracking-wider">{d.date}</p>
                    </div>
                  </AnimatedWrapper>
                ))}
              </div>
            </div>

            {/* Inquiry Form */}
            <div>
              <AnimatedWrapper direction="right" className="mb-10">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Connect</p>
                <h2 className="heading-2">Admission Inquiry</h2>
              </AnimatedWrapper>
              <AnimatedWrapper direction="right" delay={0.2}>
                <Card className="glass-card border-none shadow-2xl">
                  <CardContent className="flex flex-col gap-6 p-8">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="parent-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Parent Name</Label>
                        <Input id="parent-name" placeholder="Full name" className="h-12 border-primary/10 focus-visible:ring-primary" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="student-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Student Name</Label>
                        <Input id="student-name" placeholder="Student name" className="h-12 border-primary/10 focus-visible:ring-primary" />
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
                        <Input id="email" type="email" placeholder="email@example.com" className="h-12 border-primary/10 focus-visible:ring-primary" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone</Label>
                        <Input id="phone" type="tel" placeholder="+92 3XX XXXXXXX" className="h-12 border-primary/10 focus-visible:ring-primary" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="grade" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Applying For</Label>
                      <Select>
                        <SelectTrigger className="h-12 border-primary/10 focus-visible:ring-primary">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent className="glass-panel border-primary/10">
                          <SelectItem value="1-5">Primary (Grade 1-5)</SelectItem>
                          <SelectItem value="6-8">Middle (Grade 6-8)</SelectItem>
                          <SelectItem value="9-10">O-Level (Grade 9-10)</SelectItem>
                          <SelectItem value="11-12">A-Level (Grade 11-12)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</Label>
                      <Textarea id="message" placeholder="Include any specific queries..." rows={4} className="border-primary/10 focus-visible:ring-primary resize-none" />
                    </div>
                    <Button className="h-12 bg-burgundy-gradient text-white font-bold text-sm uppercase tracking-[0.2em] shadow-lg hover:shadow-primary/20 transition-all border-none">
                      Submit Inquiry
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedWrapper>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function AdmissionsPage() {
  return (
    <>
      <Navbar />
      <main><AdmissionsContent /></main>
      <Footer />
    </>
  )
}
