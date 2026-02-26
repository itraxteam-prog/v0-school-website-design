import { requireRole } from "@/lib/auth-guard";
import { SecurityDashboardClient } from "@/components/portal/security-dashboard-client";

export default async function TeacherSecurityPage() {
    const session = await requireRole("TEACHER");

    return <SecurityDashboardClient user={session.user} />;
}
