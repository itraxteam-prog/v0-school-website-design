import { requireRole } from "@/lib/auth-guard";
import { AdminDashboardClient } from "@/components/portal/admin-dashboard-client";

export default async function AdminDashboard() {
  await requireRole("ADMIN");

  return <AdminDashboardClient />;
}
