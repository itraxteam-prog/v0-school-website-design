"use client"

import { useState } from "react"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { FacultyModal } from "@/components/ui/faculty-modal"
import { Card, CardContent } from "@/components/ui/card"

interface FacultyMember {
    name: string;
    designation: string;
    qualifications: string;
    specialization: string;
    bio: string;
}

interface FacultySectionProps {
    faculty: FacultyMember[];
}

export function FacultySection({ faculty }: FacultySectionProps) {
    const [selectedMember, setSelectedMember] = useState<FacultyMember | null>(null)

    return (
        <>
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
        </>
    )
}
