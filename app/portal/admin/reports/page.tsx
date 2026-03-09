import { requireRole } from "@/lib/auth-guard"
import { ReportsManager } from "@/components/portal/reports-manager"
import { fetchReportData } from "@/lib/reports-utils"

export default async function AdminReportsPage({ searchParams }: { searchParams: { term?: string, classId?: string, startDate?: string, endDate?: string } }) {
  await requireRole("ADMIN");

  const { data, classes } = await fetchReportData(searchParams);

  return <ReportsManager initialData={data} classes={classes} currentFilters={searchParams} />
}

