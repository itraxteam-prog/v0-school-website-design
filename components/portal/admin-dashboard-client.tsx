"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Users, ShieldCheck, Calendar, Loader2, Mail, CheckCircle, Search, Save } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { cn, formatName } from "@/lib/utils"
import { AnimatedWrapper } from "@/components/ui/animated-wrapper"

import { useIsMobile } from "@/hooks/use-mobile"
import { MobileCardView } from "@/components/ui/mobile-card-view"

interface User {
    id: string;
    name: string;
    email: string;
    role: "STUDENT" | "TEACHER" | "ADMIN";
    createdAt?: string;
}

export function AdminDashboardClient() {
    const router = useRouter()
    const isMobile = useIsMobile();
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        // Fetch users
        fetch("/api/admin/users")
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch users", err);
                toast.error("Failed to load users");
                setLoading(false);
            });

        // Fetch stats
        fetch("/api/admin/stats")
            .then((res) => res.json())
            .then((data) => {
                setStats(data);
                setStatsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch admin stats", err);
                setStatsLoading(false);
            });
    }, []);

    async function changeRole(userId: string, role: User["role"]) {
        try {
            const response = await fetch("/api/admin/users/update-role", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, role }),
            });

            if (!response.ok) throw new Error("Update failed");

            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, role } : u))
            );
            toast.success("User role updated successfully");
            router.refresh()
        } catch (err) {
            toast.error("Failed to update user role");
        }
    }

    // Role selector component for both table and cards
    const RoleSelector = ({ user }: { user: User }) => (
        <Select
            value={user.role}
            onValueChange={(val) => changeRole(user.id, val as User["role"])}
        >
            <SelectTrigger className="w-full sm:w-[140px] h-9 glass-card border-primary/20 bg-background/50 focus:ring-primary/20">
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-panel border-border/50">
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="TEACHER">Teacher</SelectItem>
                <SelectItem value="ADMIN">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-primary" />
                        <span>Admin</span>
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    );

    return (
        <div className="p-4 sm:p-6 space-y-6">
                <AnimatedWrapper direction="down">
                    <div className="flex flex-col gap-1 mb-6">
                        <h1 className="heading-1 text-burgundy-gradient">Welcome back, {formatName(session?.user?.name?.split(' ')[0]) || 'Admin'}</h1>
                        <p className="text-sm text-muted-foreground">Manage user roles and system-level permissions.</p>
                    </div>
                </AnimatedWrapper>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard
                        title="Total Students"
                        value={stats?.stats?.totalStudents ?? 0}
                        icon={Users}
                        loading={statsLoading}
                        trend="Enrolled across classes"
                    />
                    <StatCard
                        title="Total Teachers"
                        value={stats?.stats?.totalTeachers ?? 0}
                        icon={ShieldCheck}
                        loading={statsLoading}
                        trend="Active faculty"
                    />
                    <StatCard
                        title="Today's Attendance"
                        value={stats?.stats?.attendanceToday ?? "0%"}
                        icon={Calendar}
                        loading={statsLoading}
                        trend="System-wide avg"
                        trendColor="text-green-600"
                    />
                    <StatCard
                        title="Total Classes"
                        value={stats?.stats?.totalClasses ?? 0}
                        icon={Calendar}
                        loading={statsLoading}
                        trend="Active this term"
                    />
                </div>

                <AnimatedWrapper delay={0.1}>
                    <Card className="glass-panel border-border/50 overflow-hidden shadow-burgundy-glow/5">
                        <CardHeader className="bg-muted/30 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg sm:text-xl">User Directory</CardTitle>
                                </div>
                                <Badge variant="secondary" className="rounded-full text-[10px] sm:text-xs">
                                    {users.length} Users
                                </Badge>
                            </div>
                            <CardDescription className="text-xs sm:text-sm">
                                A complete list of registered users and their current system roles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className={cn("p-0", isMobile ? "bg-secondary/40 p-4" : "")}>
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : isMobile ? (
                                <MobileCardView
                                    data={users}
                                    primaryFieldKey="name"
                                    fields={[
                                        {
                                            label: "USER", key: "name", render: (val, user) => (
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-base">{val || "Anonymous"}</span>
                                                    <span className="text-[10px] text-muted-foreground font-mono uppercase">{user.id.slice(0, 8)}...</span>
                                                </div>
                                            )
                                        },
                                        {
                                            label: "EMAIL", key: "email", render: (val) => (
                                                <div className="flex items-center gap-2 text-xs truncate">
                                                    <Mail size={12} className="opacity-50 text-primary" />
                                                    {val}
                                                </div>
                                            )
                                        },
                                        {
                                            label: "REGISTERED", key: "createdAt", render: (val) => (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Calendar size={12} className="opacity-50 text-primary" />
                                                    {val ? new Date(val).toLocaleDateString() : 'N/A'}
                                                </div>
                                            )
                                        },
                                        { label: "PERMISSION", key: "role", render: (_, user) => <RoleSelector user={user} /> }
                                    ]}
                                    emptyMessage="No users found."
                                />
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow className="border-border/50">
                                                <TableHead className="w-[250px] pl-6 uppercase text-[10px] font-bold tracking-wider text-muted-foreground">User</TableHead>
                                                <TableHead className="uppercase text-[10px] font-bold tracking-wider text-muted-foreground">Email</TableHead>
                                                <TableHead className="uppercase text-[10px] font-bold tracking-wider text-muted-foreground">Status</TableHead>
                                                <TableHead className="uppercase text-[10px] font-bold tracking-wider text-muted-foreground">Registered</TableHead>
                                                <TableHead className="pr-6 text-right uppercase text-[10px] font-bold tracking-wider text-muted-foreground">Access Level</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.length > 0 ? (
                                                users.map((user) => (
                                                    <TableRow key={user.id} className="border-border/50 hover:bg-primary/5 transition-colors group">
                                                        <TableCell className="pl-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{user.name || "Anonymous"}</span>
                                                                <span className="text-[10px] text-muted-foreground font-mono uppercase">{user.id.slice(0, 8)}...</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Mail size={14} className="opacity-50" />
                                                                {user.email}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                                ACTIVE
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="py-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar size={14} className="opacity-50" />
                                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="pr-6 text-right py-4">
                                                            <div className="flex justify-end">
                                                                <RoleSelector user={user} />
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                                        No users found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </AnimatedWrapper>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, loading, trend, trendColor }: any) {
    return (
        <AnimatedWrapper>
            <Card className="glass-panel border-border/50 transition-all active:scale-95">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                    </div>
                    <div className="mt-2 sm:mt-4">
                        {loading ? (
                            <div className="h-7 sm:h-9 w-24 bg-muted animate-pulse rounded" />
                        ) : (
                            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</h3>
                        )}
                        <p className={`text-[10px] sm:text-xs font-medium mt-1 ${trendColor || 'text-muted-foreground'}`}>
                            {trend}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </AnimatedWrapper>
    )
}
