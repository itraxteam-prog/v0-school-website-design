"use client"

import { Megaphone, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Card, CardContent } from "@/components/ui/card"

const notices = [
    { id: 1, title: "Annual Science Fair 2026 Registration Open", date: "Feb 20, 2026", type: "Urgent", content: "Students are invited to register their projects by the end of next week." },
    { id: 2, title: "Summer Internship Program for Grade 11-12", date: "Feb 18, 2026", type: "Latest", content: "Apply for our exclusive internship partners in tech and social work." },
    { id: 3, title: "Updated Examination Schedule - Term 2", date: "Feb 15, 2026", type: "Normal", content: "Please check the portal for the updated datesheet." },
]

export function NoticeBoard() {
    return (
        <section className="py-16 bg-white relative">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <AnimatedWrapper direction="left">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">Announcements</span>
                            <h2 className="heading-2">Bulletin & Notices</h2>
                        </AnimatedWrapper>
                    </div>
                    <AnimatedWrapper direction="right">
                        <button className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-3 hover:gap-5 transition-all group">
                            Explore Archive <ArrowRight className="h-4 w-4 bg-primary text-white rounded-full p-0.5 group-hover:scale-125 transition-transform" />
                        </button>
                    </AnimatedWrapper>
                </div>

                <div className="grid gap-6">
                    {notices.map((notice, index) => (
                        <AnimatedWrapper key={notice.id} delay={index * 0.1}>
                            <Card className={`glass-card border-none overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 ${notice.type === 'Urgent' ? 'ring-1 ring-primary/20' : ''}`}>
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        <div className={`p-6 md:w-56 flex flex-col justify-center items-start border-b md:border-b-0 md:border-r border-primary/5 ${notice.type === 'Urgent' ? 'bg-burgundy-glow text-white' : 'bg-muted/30'}`}>
                                            {notice.type === 'Urgent' && (
                                                <Badge className="bg-white text-primary hover:bg-white mb-3 animate-pulse ring-4 ring-white/20 text-[10px] font-bold uppercase">
                                                    Urgent
                                                </Badge>
                                            )}
                                            {notice.type === 'Latest' && (
                                                <Badge className="bg-primary hover:bg-primary text-white mb-3 text-[10px] font-bold uppercase">
                                                    Latest
                                                </Badge>
                                            )}
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${notice.type === 'Urgent' ? 'text-white/70' : 'text-muted-foreground'}`}>{notice.date}</span>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col justify-center">
                                            <h3 className="heading-3 mb-2 line-clamp-1">{notice.title}</h3>
                                            <p className="text-sm text-muted-foreground font-medium line-clamp-1 italic">&ldquo;{notice.content}&rdquo;</p>
                                        </div>
                                        <div className="p-6 md:pr-8 flex items-center justify-end">
                                            <button className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                                                <ArrowRight className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedWrapper>
                    ))}
                </div>
            </div>
        </section>
    )
}
