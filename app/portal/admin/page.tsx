'use client'

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ADMIN_SIDEBAR as sidebarItems } from "@/lib/navigation-config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, ShieldCheck, Mail, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";

interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  createdAt?: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
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
    } catch (err) {
      toast.error("Failed to update user role");
    }
  }

  return (
    <AppLayout sidebarItems={sidebarItems} userName="Admin" userRole="admin">
      <div className="p-6 space-y-6">
        <AnimatedWrapper direction="down">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="heading-1 text-burgundy-gradient">Admin Operational Controls</h1>
            <p className="text-sm text-muted-foreground">Manage user roles and system-level permissions.</p>
          </div>
        </AnimatedWrapper>

        <AnimatedWrapper delay={0.1}>
          <Card className="glass-panel border-border/50 overflow-hidden shadow-burgundy-glow/5">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">User Directory</CardTitle>
              </div>
              <CardDescription>
                A complete list of registered users and their current system roles.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
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
                                <Select
                                  value={user.role}
                                  onValueChange={(val) => changeRole(user.id, val as User["role"])}
                                >
                                  <SelectTrigger className="w-[140px] h-9 glass-card border-primary/20 bg-background/50 focus:ring-primary/20">
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
    </AppLayout>
  );
}
