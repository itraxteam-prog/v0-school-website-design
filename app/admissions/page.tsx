"use client"

import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardCheck, FileText, UserCheck, CalendarDays } from "lucide-react"

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
  const ref = useScrollAnimation()

  return (
    <div ref={ref}>
      {/* Hero */}
      <section className="bg-foreground py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="animate-on-scroll max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/50">Admissions</p>
            <h1 className="heading-1 mb-4 text-balance text-primary-foreground">Join Our Community</h1>
            <p className="text-base leading-relaxed text-primary-foreground/70 md:text-lg">
              Begin your journey at The Pioneers High School. We welcome students who are eager to learn, grow, and excel.
            </p>
          </div>
        </div>
      </section>

      {/* Admission Steps */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="animate-on-scroll mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Process</p>
            <h2 className="heading-2 text-foreground">How to Apply</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.step} className="animate-on-scroll relative flex flex-col items-center text-center" style={{ transitionDelay: `${i * 100}ms` }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+32px)] top-8 hidden h-px w-[calc(100%-64px)] bg-border lg:block" />
                )}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-primary">{s.step}</p>
                <h3 className="mt-1 font-serif text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="animate-on-scroll mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Fees</p>
            <h2 className="heading-2 text-foreground">Fee Structure</h2>
          </div>
          <div className="animate-on-scroll overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-4 py-3 font-semibold text-foreground">Grade Level</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Admission Fee (PKR)</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Monthly Fee (PKR)</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Annual Fee (PKR)</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f, i) => (
                  <tr key={f.level} className={`border-b border-border transition-colors hover:bg-primary/5 ${i % 2 === 0 ? "bg-card" : "bg-muted/50"}`}>
                    <td className="px-4 py-3 font-medium text-foreground">{f.level}</td>
                    <td className="px-4 py-3 text-muted-foreground">{f.admission}</td>
                    <td className="px-4 py-3 text-muted-foreground">{f.monthly}</td>
                    <td className="px-4 py-3 text-muted-foreground">{f.annual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Dates */}
            <div>
              <div className="animate-on-scroll mb-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Schedule</p>
                <h2 className="heading-2 text-foreground">Important Dates</h2>
              </div>
              <div className="flex flex-col gap-4">
                {dates.map((d, i) => (
                  <div key={d.event} className="animate-on-scroll flex items-center gap-4 rounded-lg border border-border bg-card p-4" style={{ transitionDelay: `${i * 80}ms` }}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{d.event}</p>
                      <p className="text-xs text-muted-foreground">{d.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiry Form */}
            <div>
              <div className="animate-on-scroll mb-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Inquire</p>
                <h2 className="heading-2 text-foreground">Admission Inquiry</h2>
              </div>
              <Card className="animate-on-scroll border-border">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="parent-name">Parent / Guardian Name</Label>
                      <Input id="parent-name" placeholder="Full name" className="h-11" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="student-name">Student Name</Label>
                      <Input id="student-name" placeholder="Student full name" className="h-11" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="email@example.com" className="h-11" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+92 300 0000000" className="h-11" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="grade">Grade Applying For</Label>
                    <Select>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">Primary (Grade 1-5)</SelectItem>
                        <SelectItem value="6-8">Middle (Grade 6-8)</SelectItem>
                        <SelectItem value="9-10">O-Level (Grade 9-10)</SelectItem>
                        <SelectItem value="11-12">A-Level (Grade 11-12)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Any additional information..." rows={4} />
                  </div>
                  <Button className="h-11 bg-primary text-primary-foreground hover:bg-primary/90">
                    Submit Inquiry
                  </Button>
                  <p className="text-xs text-muted-foreground">This form is a visual mockup only. No data will be submitted.</p>
                </CardContent>
              </Card>
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
