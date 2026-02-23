import { requireAuth } from "@/lib/auth-guard";
import { SecurityDashboardClient } from "@/components/portal/security-dashboard-client";

export default async function SecurityPage() {
    const session = await requireAuth();

    return <SecurityDashboardClient user={session.user} />;
}
