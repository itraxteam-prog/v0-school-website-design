import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-guard"
import { ReportsManager } from "@/components/portal/reports-manager"

export default async function AdminReportsPage() {
  await requireRole("ADMIN");

  // Fetch real data
  const [students, teachers, grades, attendance] = await Promise.all([
    prisma.user.findMany({
      where: { role: "STUDENT" },
      take: 10,
      include: { profile: true }
    }),
    prisma.user.findMany({
      where: { role: "TEACHER" },
      take: 10,
      include: { profile: true }
    }),
    prisma.grade.findMany({
      take: 100,
      include: { student: { include: { profile: true } } }
    }),
    prisma.attendance.findMany({
      where: {
        date: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      }
    })
  ]);

  // Format student performance
  const studentPerformance = students.map(s => {
    const studentGrades = grades.filter(g => g.studentId === s.id);
    const avgScore = studentGrades.length > 0 
      ? Math.round(studentGrades.reduce((acc, g) => acc + g.marks, 0) / studentGrades.length) 
      : 0;
    
    return {
      rollNo: s.profile?.rollNumber || "N/A",

      name: s.name || "Unknown",
      attendance: "95%", // Simplified for now
      grade: avgScore >= 90 ? "A+" : avgScore >= 80 ? "A" : avgScore >= 70 ? "B" : "C",
      remarks: avgScore >= 80 ? "Excellent" : "Needs Work"
    };
  });

  // Format teacher performance
  const teacherPerformance = teachers.map(t => ({
    name: t.name || "Unknown",
    classes: "Grade 10", // Placeholder
    grade: "A",
    attendance: "98%"
  }));

  // Format attendance chart (last 5 days)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const attendanceChart = days.map(day => ({
    day,
    attendance: 90 + Math.floor(Math.random() * 10) // Small simulated variation for trend
  }));

  const data = {
    studentPerformance,
    teacherPerformance,
    attendanceChart
  };

  return <ReportsManager initialData={data} />
}

