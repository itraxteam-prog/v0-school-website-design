"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { toast } from "sonner"

export function AdmissionForm() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        toast.success("Inquiry submitted successfully!")
    }

    return (
        <AnimatedWrapper direction="right" delay={0.2}>
            <Card className="glass-card border-none shadow-2xl">
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="parent-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Parent Name</Label>
                                <Input id="parent-name" placeholder="Full name" className="h-12 border-primary/10 focus-visible:ring-primary" required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="student-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Student Name</Label>
                                <Input id="student-name" placeholder="Student name" className="h-12 border-primary/10 focus-visible:ring-primary" required />
                            </div>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
                                <Input id="email" type="email" placeholder="email@example.com" className="h-12 border-primary/10 focus-visible:ring-primary" required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone</Label>
                                <Input id="phone" type="tel" placeholder="+92 3XX XXXXXXX" className="h-12 border-primary/10 focus-visible:ring-primary" required />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="grade" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Applying For</Label>
                            <Select required>
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
                            <Textarea id="message" placeholder="Include any specific queries..." rows={4} className="border-primary/10 focus-visible:ring-primary resize-none" required />
                        </div>
                        <Button type="submit" className="h-12 bg-burgundy-gradient text-white font-bold text-sm uppercase tracking-[0.2em] shadow-lg hover:shadow-primary/20 transition-all border-none">
                            Submit Inquiry
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AnimatedWrapper>
    )
}
