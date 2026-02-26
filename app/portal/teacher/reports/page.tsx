import { TeacherReportsManager } from "@/components/portal/teacher-reports-manager"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function TeacherReportsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) return null

  let studentReports: any[] = []

  try {
    // Query students enrolled in classes taught by this teacher
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        classes: { some: { teacherId: session.user.id } }
      },
      select: {
        id: true,
        name: true,
        classes: {
          where: { teacherId: session.user.id },
          select: {
            grades: { where: { studentId: { not: undefined } }, select: { marks: true, studentId: true } },
            attendances: { where: { studentId: { not: undefined } }, select: { status: true, studentId: true } },
          }
        }
      }
    })

    if (students.length > 0) {
      studentReports = students.map(s => {
        const allGrades = s.classes.flatMap(c => c.grades.filter(g => g.studentId === s.id))
        const allAttendances = s.classes.flatMap(c => c.attendances.filter(a => a.studentId === s.id))

        const avgGrade = allGrades.length > 0
          ? Math.round(allGrades.reduce((acc: number, g: any) => acc + g.marks, 0) / allGrades.length)
          : 0

        const attendanceCount = allAttendances.length
        const presentCount = allAttendances.filter((a: any) => a.status === "present").length
        const attendanceRate = attendanceCount > 0
          ? Math.round((presentCount / attendanceCount) * 100)
          : 100

        return {
          id: s.id,
          name: s.name || "Unknown",
          attendance: attendanceRate,
          avgGrade: avgGrade,
          status: avgGrade > 85 ? "Excellent" : (avgGrade > 70 ? "Good" : "Average")
        }
      })
    } else {
      // Mock fallback
      studentReports = [
        { id: "S001", name: "Ahmed Khan", attendance: 95, avgGrade: 88, status: "Excellent" },
        { id: "S002", name: "Sara Ali", attendance: 98, avgGrade: 94, status: "Excellent" },
      ];
    }
  } catch (error) {
    console.error("Failed to fetch teacher reports data", error)
  }

  // Baseline Mock Data for charts
  const performanceData = [
    { name: "Unit 1", avg: 85, top: 98 },
    { name: "Unit 2", avg: 78, top: 95 },
    { name: "Midterm", avg: 82, top: 100 },
    { name: "Unit 3", avg: 86, top: 97 },
    { name: "Current", avg: 84, top: 99 },
  ];

  const attendanceTrendData = [
    { month: "Sep", rate: 94 },
    { month: "Oct", rate: 92 },
    { month: "Nov", rate: 89 },
    { month: "Dec", rate: 85 },
    { month: "Jan", rate: 91 },
    { month: "Feb", rate: 95 },
  ];

  return (
    <TeacherReportsManager
      initialPerformanceData={performanceData}
      initialAttendanceTrendData={attendanceTrendData}
      initialStudentReports={studentReports}
    />
  )
}
