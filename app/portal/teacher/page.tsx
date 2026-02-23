import { requireRole } from "@/lib/auth-guard";
import { TeacherDashboardClient } from "@/components/portal/teacher-dashboard-client";

export default async function TeacherDashboard() {
  const session = await requireRole("TEACHER");

  return <TeacherDashboardClient user={session.user} />;
}
