"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })

interface FacultyMember {
    name: string
    designation: string
    qualifications: string
    specialization: string
    bio: string
    image?: string
}

interface FacultyModalProps {
    member: FacultyMember | null
    isOpen: boolean
    onClose: () => void
}

export function FacultyModal({ member, isOpen, onClose }: FacultyModalProps) {
    if (!member) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] glass-panel border-none">
                <div className="flex flex-col md:flex-row gap-6 p-4">
                    <div className="w-full md:w-1/3 aspect-square bg-muted rounded-xl relative overflow-hidden flex items-center justify-center border border-white/20">
                        <span className="text-muted-foreground text-xs uppercase font-medium">Photo Placeholder</span>
                    </div>
                    <div className="flex-1 space-y-4">
                        <DialogHeader>
                            <DialogTitle className={`${playfair.className} text-3xl font-bold text-burgundy-gradient`}>
                                {member.name}
                            </DialogTitle>
                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                                {member.designation}
                            </p>
                        </DialogHeader>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-bold uppercase text-primary/70">Qualifications</p>
                                <p className="text-sm">{member.qualifications}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-primary/70">Specialization</p>
                                <p className="text-sm">{member.specialization}</p>
                            </div>
                            <div className="pt-2">
                                <p className="text-sm leading-relaxed text-foreground/80 italic">
                                    "{member.bio}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
