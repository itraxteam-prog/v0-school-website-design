"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

const contactInfo = [
  { icon: MapPin, label: "Address", value: "99 Street, Near Milo Chowk Alamdar Road, Quetta." },
  { icon: Phone, label: "Phone", value: "+92 313 8692098, +92 315 8020097" },
  { icon: Mail, label: "Email", value: "thepioneershighschool@gmail.com" },
  { icon: Clock, label: "Office Hours", value: "Mon - Fri: 8:00 AM - 8:00 PM" },
]

const departments = [
  { name: "Admissions Office", phone: "+92 313 8692098, +92 315 8020097", email: "thepioneershighschool@gmail.com" },
  { name: "Academics Department", phone: "+92 313 8692098, +92 315 8020097", email: "thepioneershighschool@gmail.com" },
  { name: "Finance & Accounts", phone: "+92 313 8692098, +92 315 8020097", email: "thepioneershighschool@gmail.com" },
  { name: "Student Affairs", phone: "+92 313 8692098, +92 315 8020097", email: "thepioneershighschool@gmail.com" },
]

import { useState } from "react"
import { toast } from "sonner"

function ContactContent() {
  const ref = useScrollAnimation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: "general"
        }),
      })

      if (res.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.")
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        })
      } else {
        throw new Error("Failed to send")
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    const field = id === "c-name" ? "name" : id === "c-email" ? "email" : id === "c-phone" ? "phone" : id === "c-subject" ? "subject" : id
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div ref={ref}>
      {/* Hero */}
      <section className="bg-[#0a0a0a] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-burgundy-gradient opacity-90" />
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 relative z-10">
          <div className="animate-on-scroll max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50">Contact Us</p>
            <h1 className="heading-1 mb-4 text-balance text-white">Get in Touch</h1>
            <p className="text-base leading-relaxed text-white/80 md:text-lg">
              Have a question or need more information? We are here to help. Reach out to us through any of the channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="animate-on-scroll mb-6">
                <h2 className="heading-2 text-foreground">Send Us a Message</h2>
              </div>
              <Card className="animate-on-scroll border-border">
                <CardContent className="flex flex-col gap-4 p-6">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="c-name">Full Name</Label>
                        <Input
                          id="c-name"
                          placeholder="Your name"
                          className="h-11"
                          required
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="c-email">Email Address</Label>
                        <Input
                          id="c-email"
                          type="email"
                          placeholder="email@example.com"
                          className="h-11"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="c-phone">Phone Number</Label>
                        <Input
                          id="c-phone"
                          type="tel"
                          placeholder="+92 300 0000000"
                          className="h-11"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="c-subject">Subject</Label>
                        <Select
                          required
                          onValueChange={(val) => setFormData(prev => ({ ...prev, subject: val }))}
                          value={formData.subject}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                            <SelectItem value="Admissions">Admissions</SelectItem>
                            <SelectItem value="Academics">Academics</SelectItem>
                            <SelectItem value="Fee Information">Fee Information</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="c-message">Message</Label>
                      <Textarea
                        id="c-message"
                        placeholder="Write your message here..."
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="animate-on-scroll mb-6">
                <h2 className="heading-2 text-foreground">Contact Info</h2>
              </div>
              <div className="flex flex-col gap-4">
                {contactInfo.map((c, i) => (
                  <div key={c.label} className="animate-on-scroll flex items-start gap-4 rounded-xl border border-border/50 bg-card p-4 shadow-sm" style={{ transitionDelay: `${i * 80}ms` }}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-burgundy-gradient text-white shadow-md">
                      <c.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.label}</p>
                      <p className="whitespace-pre-line text-sm text-muted-foreground">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="animate-on-scroll mb-8 text-center">
            <h2 className="heading-2 text-foreground">Find Us</h2>
          </div>
          <div className="animate-on-scroll flex aspect-[16/7] items-center justify-center rounded-lg border border-border bg-muted">
            <p className="text-sm text-muted-foreground">Map Placeholder</p>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div className="animate-on-scroll mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Departments</p>
            <h2 className="heading-2 text-foreground">Department Contacts</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((d, i) => (
              <Card key={d.name} className="animate-on-scroll glass-card border-none" style={{ transitionDelay: `${i * 80}ms` }}>
                <CardContent className="flex flex-col gap-2 p-5">
                  <h3 className="font-serif text-sm font-semibold text-card-foreground">{d.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{d.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{d.email}</span>
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

export default function ContactPage() {
  return <ContactContent />
}
