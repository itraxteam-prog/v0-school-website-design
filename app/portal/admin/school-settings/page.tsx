import { requireRole } from "@/lib/auth-guard";
import { SchoolSettingsDashboardClient } from "@/components/portal/school-settings-dashboard-client";

export default async function SchoolSettingsPage() {
    const session = await requireRole("ADMIN");

    return <SchoolSettingsDashboardClient user={session.user} />;
}
