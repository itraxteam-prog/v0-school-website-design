import { requireRole } from "@/lib/auth-guard";
import { UserManagementDashboardClient } from "@/components/portal/user-management-dashboard-client";

export default async function UserManagementPage() {
  const session = await requireRole("ADMIN");

  return <UserManagementDashboardClient user={session.user} />;
}
