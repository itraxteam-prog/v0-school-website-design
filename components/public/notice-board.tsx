import { Megaphone, ArrowRight, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"
import { Card, CardContent } from "@/components/ui/card"
import { sanitizeHtml } from "@/lib/sanitize"
import { prisma } from "@/lib/prisma"

export async function NoticeBoard() {
    const notices = await prisma.announcement.findMany({
        where: {
            targetRole: "HOMEPAGE"
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 3
    })

    if (notices.length === 0) return null;

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="space-y-4">
                        <AnimatedWrapper direction="left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <Megaphone className="h-3.5 w-3.5 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Official Updates</span>
                            </div>
                            <h2 className="heading-2 mt-4">Bulletin & Notices</h2>
                        </AnimatedWrapper>
                    </div>
                    <AnimatedWrapper direction="right">
                        <button className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-3 hover:gap-5 transition-all group">
                            Explore Archive <ArrowRight className="h-4 w-4 bg-primary text-white rounded-full p-0.5 group-hover:scale-125 transition-transform" />
                        </button>
                    </AnimatedWrapper>
                </div>

                <div className="grid gap-8">
                    {notices.map((notice, index) => (
                        <AnimatedWrapper key={notice.id} delay={index * 0.1}>
                            <Card className="glass-card border-none overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="p-8 md:w-64 flex flex-col justify-center items-start bg-muted/30 border-b md:border-b-0 md:border-r border-border/50 relative">
                                            <Badge className="bg-primary hover:bg-primary text-white mb-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                                                Latest
                                            </Badge>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                                    {new Date(notice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-8 flex-1 flex flex-col justify-center bg-gradient-to-r from-transparent to-primary/5">
                                            <h3 className="heading-3 mb-3 group-hover:text-primary transition-colors">{notice.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed italic text-base">
                                                &ldquo;{sanitizeHtml(notice.content)}&rdquo;
                                            </p>
                                        </div>
                                        <div className="p-8 flex items-center justify-end">
                                            <button className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-burgundy-glow">
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
