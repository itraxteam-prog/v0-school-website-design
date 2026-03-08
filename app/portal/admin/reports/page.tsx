import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-guard"
import { ReportsManager } from "@/components/portal/reports-manager"

export default async function AdminReportsPage({ searchParams }: { searchParams: { term?: string, classId?: string, startDate?: string, endDate?: string } }) {
  await requireRole("ADMIN");

  const { term, classId, startDate, endDate } = searchParams;

  // Build filters
  const studentWhere: any = { role: "STUDENT" };
  if (classId && classId !== "all") {
    studentWhere.classId = classId;
  }

  const gradeWhere: any = { NOT: { term: { endsWith: "-draft" } } };
  if (term) gradeWhere.term = term;
  if (classId && classId !== "all") gradeWhere.student = { classId };

  const attendanceWhere: any = {};
  if (classId && classId !== "all") attendanceWhere.student = { classId };
  if (startDate && endDate) {
    attendanceWhere.date = { gte: new Date(startDate), lte: new Date(endDate) };
  } else {
    // Default to last 30 days if no date range provided
    attendanceWhere.date = { gte: new Date(new Date().setDate(new Date().getDate() - 30)) };
  }

  // Fetch real data
  const [students, teachers, grades, attendance, classes] = await Promise.all([
    prisma.user.findMany({
      where: studentWhere,
      include: { profile: true, classes: { select: { id: true, name: true } } }
    }),
    prisma.user.findMany({
      where: { role: "TEACHER" },
      include: { profile: true, taughtClasses: { select: { id: true, name: true } } }
    }),
    prisma.grade.findMany({
      where: gradeWhere
    }),
    prisma.attendance.findMany({
      where: attendanceWhere
    }),
    prisma.class.findMany({
      select: { id: true, name: true }
    })
  ]);

  // Format student performance
  const studentPerformance = students.map(s => {
    const studentGrades = grades.filter(g => g.studentId === s.id);
    const avgScore = studentGrades.length > 0
      ? Math.round(studentGrades.reduce((acc, g) => acc + g.marks, 0) / studentGrades.length)
      : 0;

    const studentAtt = attendance.filter(a => a.studentId === s.id);
    const attPercent = studentAtt.length > 0
      ? Math.round((studentAtt.filter(a => a.status === "PRESENT").length / studentAtt.length) * 100)
      : 100;

    return {
      rollNo: s.profile?.rollNumber || "N/A",
      name: s.name || "Unknown",
      attendance: `${attPercent}%`,
      grade: avgScore >= 90 ? "A+" : avgScore >= 80 ? "A" : avgScore >= 70 ? "B" : "C",
      remarks: avgScore >= 80 ? "Excellent" : "Needs Work"
    };
  });

  // Format teacher performance
  const teacherPerformance = teachers.map(t => {
    const clsNames = t.taughtClasses.map(c => c.name).join(", ") || "None";
    // For live data, we could calculate actual average student grades for this teacher's classes
    // But for this phase, we keep the formatting clean without mock percentages
    return {
      name: t.name || "Unknown",
      classes: clsNames,
      grade: "A",
      attendance: "N/A"
    };
  });

  // Format attendance chart
  const attendanceMap: Record<string, { count: number, present: number }> = {};
  attendance.forEach(a => {
    const dateStr = a.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!attendanceMap[dateStr]) attendanceMap[dateStr] = { count: 0, present: 0 };
    attendanceMap[dateStr].count++;
    if (a.status === "PRESENT") attendanceMap[dateStr].present++;
  });

  const attendanceChart = Object.entries(attendanceMap).map(([day, stats]) => ({
    day,
    attendance: Math.round((stats.present / stats.count) * 100)
  })).sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

  const totalStudents = students.length;
  const overallAtt = attendance.length > 0
    ? Math.round((attendance.filter(a => a.status === "PRESENT").length / attendance.length) * 100)
    : 0;

  const data = {
    studentPerformance,
    teacherPerformance,
    attendanceChart,
    summary: {
      overallAttendance: `${overallAtt}%`,
      totalStudents,
      absenteeRate: `${100 - overallAtt}%`
    }
  };

  return <ReportsManager initialData={data} classes={classes} currentFilters={searchParams} />
}

