import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Heart, Quote } from "lucide-react"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"

const timeline = [
  { year: "1995", title: "Foundation", description: "The Pioneers High School was established with a vision for quality education." },
  { year: "2002", title: "Cambridge Affiliation", description: "Became an affiliated Cambridge Assessment International Education center." },
  { year: "2010", title: "Campus Expansion", description: "Opened new state-of-the-art science labs, library, and sports complex." },
  { year: "2018", title: "Digital Transformation", description: "Introduced smart classrooms and integrated digital learning platforms." },
  { year: "2024", title: "Regional Excellence", description: "Recognized as a top-performing institution in the region." },
]

const leaders = [
  { name: "Mr. Muhammad Asif Shahyan", role: "CEO", department: "Administration", image: "/images/ceo.jpg" },
  { name: "Ms. Saeeda Sahar", role: "Principal", department: "Administration" },
  { name: "Ms. Shazia", role: "Head", department: "Middle Section" },
  { name: "Ms. Zainab", role: "Head", department: "Primary Section" },
]

const values = [
  {
    icon: Eye,
    title: "Our Vision",
    description: "To see The Pioneers School and English Language System as standard educational and ethical oriented institute determined on cognitive moral development of children."
  },
  {
    icon: Target,
    title: "Our Mission",
    description: "To actualize our vision in safe environment maximally conductive to learning... By striving for excellence..."
  },
  {
    icon: Heart,
    title: "Our Values",
    description: "Godliness, truthfulness, integrity, reasoned judgment, self-esteem, tolerance, respect for human dignity."
  },
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
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {leaders.map((leader, i) => (
              <AnimatedWrapper key={leader.name} delay={i * 0.1}>
                <Card className="glass-card border-none text-center h-full group">
                  <CardContent className="flex flex-col items-center gap-4 p-8">
                    {leader.image ? (
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted overflow-hidden border border-white/20 shadow-inner group-hover:scale-105 transition-transform">
                        <img src={leader.image} alt={leader.name} className="h-full w-full object-cover" />
                      </div>
                    ) : null}
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

      {/* Founders Messages */}
      <section className="bg-secondary/30 py-16 md:py-28 overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="flex flex-col gap-24 lg:gap-32">
            {/* CEO Message */}
            <AnimatedWrapper direction="up">
              <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                <div className="lg:col-span-4 relative group">
                  <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-muted relative z-10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                    <img src="/images/ceo.jpg" alt="Mr. Muhammad Asif Shahyan" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute -inset-4 bg-burgundy-glow rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                  <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-background rounded-3xl shadow-xl flex items-center justify-center text-primary z-20">
                    <Quote className="h-10 w-10 fill-primary/10 stroke-primary/40" />
                  </div>
                </div>
                <div className="lg:col-span-8 relative">
                  <Quote className="absolute -top-16 -left-10 h-32 w-32 text-primary/5 -z-10" />
                  <div className="space-y-6">
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.4em] text-primary">Founders Statement</p>
                      <h2 className="heading-1 font-serif text-foreground">Message from <span className="text-burgundy-gradient">The CEO</span></h2>
                    </div>
                    <div className="h-1 w-20 bg-burgundy-gradient rounded-full" />
                    <p className="text-lg md:text-xl leading-relaxed text-muted-foreground italic font-medium">
                      "Mr. Muhammad Asif Shahyan, with his rich background in debating and literature, is dedicated to providing quality education that balances academic excellence with cognitive and moral development."
                    </p>
                    <div className="pt-4">
                      <p className="text-xl font-serif font-bold text-primary">Mr. Muhammad Asif Shahyan</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Chief Executive Officer</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedWrapper>

            {/* Principal Message */}
            <AnimatedWrapper direction="up" delay={0.2}>
              <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                <div className="lg:col-span-8 order-2 lg:order-1 relative">
                  <Quote className="absolute -bottom-16 -right-10 h-32 w-32 text-primary/5 -z-10 rotate-180" />
                  <div className="space-y-6 lg:text-right flex flex-col lg:items-end">
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.4em] text-primary">Leadership Insights</p>
                      <h2 className="heading-1 font-serif text-foreground">Message from <span className="text-burgundy-gradient">The Principal</span></h2>
                    </div>
                    <div className="h-1 w-20 bg-burgundy-gradient rounded-full" />
                    <p className="text-lg md:text-xl leading-relaxed text-muted-foreground italic font-medium max-w-2xl">
                      "Ms. Saeeda Sahar emphasizes the importance of formative childhood education. Her message highlights our commitment to maintaining a standard of education that prepares students for the challenges of the future while remaining rooted in ethical values."
                    </p>
                    <div className="pt-4">
                      <p className="text-xl font-serif font-bold text-primary">Ms. Saeeda Sahar</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">School Principal</p>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-4 order-1 lg:order-2 relative group hidden">
                  {/* Portrait Hidden as requested */}
                </div>
              </div>
            </AnimatedWrapper>
          </div>
        </div>
      </section>

      {/* Distinctive Features */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <AnimatedWrapper direction="up" className="mb-16 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">What Sets Us Apart</p>
            <h2 className="heading-2">Distinctive Features</h2>
          </AnimatedWrapper>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="glass-card border-none">
              <CardContent className="p-8">
                <h3 className="heading-3 mb-4 text-primary">Ethics in Syllabus</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">"Included ethic in our syllabus and pupils will be taught and exercised the ethical actions."</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-none">
              <CardContent className="p-8">
                <h3 className="heading-3 mb-4 text-primary">Spoken English Focus</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">"Definite plans and dynamics to build an English speaking culture..."</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-none">
              <CardContent className="p-8">
                <h3 className="heading-3 mb-4 text-primary">Effective Learning</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">"Ongoing system of school-based teacher education and training."</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function AboutPage() {
  return <AboutContent />
}
