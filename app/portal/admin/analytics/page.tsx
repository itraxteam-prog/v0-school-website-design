import { requireRole } from "@/lib/auth-guard";
import { AnalyticsDashboardClient } from "@/components/portal/analytics-dashboard-client";

export default async function AnalyticsPage() {
  const session = await requireRole("ADMIN");

  return <AnalyticsDashboardClient user={session.user} />;
}
