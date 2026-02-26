import { requireRole } from "@/lib/auth-guard";
import { SecurityDashboardClient } from "@/components/portal/security-dashboard-client";

export default async function StudentSecurityPage() {
    const session = await requireRole("STUDENT");

    return <SecurityDashboardClient user={session.user} />;
}
