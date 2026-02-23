import { requireRole } from "@/lib/auth-guard";
import { StudentDashboardClient } from "@/components/portal/student-dashboard-client";

export default async function StudentDashboard() {
  const session = await requireRole("STUDENT");

  return <StudentDashboardClient user={session.user} />;
}
