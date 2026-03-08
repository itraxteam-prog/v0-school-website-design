import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, FileText, UserCheck, CalendarDays, BookOpen } from "lucide-react"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { AdmissionForm } from "@/components/public/admission-form"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const steps = [
  { icon: FileText, step: "01", title: "Submit Application", description: "Fill out the online inquiry form or collect an application from our admissions office." },
  { icon: ClipboardCheck, step: "02", title: "Entrance Assessment", description: "Students take a placement test to evaluate academic readiness for the appropriate grade level." },
  { icon: UserCheck, step: "03", title: "Interview", description: "A brief interview with the student and parents to understand goals and expectations." },
  { icon: CalendarDays, step: "04", title: "Enrollment", description: "Upon acceptance, complete enrollment documentation and fee submission to secure the seat." },
]

const fees = [
  { level: "Primary (Grade 1-5)", admission: "8,000", monthly: "2,500", annual: "30,000" },
  { level: "Middle (Grade 6-8)", admission: "8,000", monthly: "2,800", annual: "33,600" },
  { level: "High (Grade 9-10)", admission: "8,000", monthly: "3,000", annual: "36,000" },
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
      <section className="bg-[#0a0a0a] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-burgundy-gradient opacity-90" />
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 relative z-10">
          <AnimatedWrapper direction="down" className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50">Admissions 2026</p>
            <h1 className="heading-1 mb-4 text-balance text-white font-serif">Join Our Community</h1>
            <p className="text-base leading-relaxed text-white/80 md:text-lg">
              Begin your journey at The Pioneers High School. We welcome students who are eager to learn, grow, and excel.
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

      {/* Admission Requirements & Withdrawal */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <AnimatedWrapper direction="left">
              <h2 className="heading-2 mb-8">Required Documents</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    For Fresh Admits
                  </h3>
                  <ul className="grid gap-3 pl-4">
                    {["Parent/Guardian CNIC", "Birth Certificate", "Two 1x1 Photos"].map(doc => (
                      <li key={doc} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/20" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    For Migrating Students
                  </h3>
                  <ul className="grid gap-3 pl-4">
                    {["Parent/Guardian CNIC", "Last Progress Report", "Two 1x1 Photos", "School Leaving Certificate"].map(doc => (
                      <li key={doc} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/20" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedWrapper>

            <AnimatedWrapper direction="right">
              <div className="rounded-3xl bg-burgundy-gradient p-8 text-white shadow-2xl relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <FileText className="h-32 w-32" />
                </div>
                <h2 className="heading-2 mb-6">Withdrawal Procedure</h2>
                <p className="mb-8 text-white/80 leading-relaxed font-medium">
                  Our withdrawal process is designed to be transparent and efficient for parents.
                </p>
                <div className="grid gap-6">
                  {[
                    { title: "Get Form", text: "Collect the withdrawal form from the school office." },
                    { title: "Clear Dues", text: "Ensure all school dues and library books are cleared." },
                    { title: "Processing Time", text: "SLC will be issued after document verification." }
                  ].map((step, i) => (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">{step.title}</h4>
                        <p className="text-sm text-white/70">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedWrapper>
          </div>
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
              <AdmissionForm />
            </div>
          </div>
        </div>
      </section>

      {/* Code of Conduct */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <AnimatedWrapper direction="up" className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Policies</p>
            <h2 className="heading-2">Code of Conduct & Guidelines</h2>
          </AnimatedWrapper>
          <AnimatedWrapper direction="up" delay={0.2} className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="bg-background px-6 rounded-2xl mb-4 border-none shadow-sm">
                <AccordionTrigger className="hover:no-underline py-6">
                  <span className="text-left font-bold text-primary">General Rules of Good Order and Discipline</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  <ul className="grid gap-3">
                    <li>Strict adherence to school uniforms and personal hygiene standards.</li>
                    <li>Prior written notification required for student absence.</li>
                    <li>Restricted items (mobile phones, electronic gadgets, etc.) are strictly prohibited on campus.</li>
                    <li>Respectful behavior towards faculty, staff, and fellow students at all times.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-background px-6 rounded-2xl border-none shadow-sm">
                <AccordionTrigger className="hover:no-underline py-6">
                  <span className="text-left font-bold text-primary">Guidelines for Parents/Guardians</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  <ul className="grid gap-3">
                    <li>Active attendance and participation in Parent-Teacher Meetings (PTMs) is mandatory.</li>
                    <li>Ensuring student punctuality for school timings.</li>
                    <li>Submit all concerns or complaints directly through the school administration office.</li>
                    <li>Support the school's educational and disciplinary policies at home.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AnimatedWrapper>
        </div>
      </section>
    </div>
  )
}

export default function AdmissionsPage() {
  return <AdmissionsContent />
}
