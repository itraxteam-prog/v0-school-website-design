import { requireRole } from "@/lib/auth-guard";
import { SecurityDashboardClient } from "@/components/portal/security-dashboard-client";

export default async function AdminSecurityPage() {
    const session = await requireRole("ADMIN");

    return <SecurityDashboardClient user={session.user} />;
}
