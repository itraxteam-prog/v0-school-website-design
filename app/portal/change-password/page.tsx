import { requireAuth } from "@/lib/auth-guard";
import { ChangePasswordDashboardClient } from "@/components/portal/change-password-dashboard-client";

export default async function ChangePasswordPage() {
    const session = await requireAuth();

    return <ChangePasswordDashboardClient user={session.user} />;
}
