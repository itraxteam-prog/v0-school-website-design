import { TeacherReportsManager } from "@/components/portal/teacher-reports-manager"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function TeacherReportsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) return null

  let studentReports: any[] = []
  let studentsData: any[] = [] // Declare studentsData here to be accessible later

  try {
    // Query students enrolled in classes taught by this teacher
    studentsData = await prisma.user.findMany({
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
            id: true,
            name: true,
            grades: {
              where: {
                NOT: { term: { endsWith: "-draft" } }
              },
              select: { marks: true, term: true, classId: true }
            },
            attendances: {
              select: { status: true, date: true, classId: true }
            },
          }
        }
      }
    })

    if (studentsData && studentsData.length > 0) {
      // Assign raw data for client-side processing
      studentReports = studentsData.map(s => ({
        ...s,
        classes: s.classes || []
      }));
    } else {
      studentReports = [];
    }
  } catch (error) {
    console.error("Failed to fetch teacher reports data", error)
    studentReports = [];
  }

  // Fetch academic settings for dynamic terms
  let termStructure = "3";
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "termStructure" } });
    if (setting?.value) termStructure = setting.value;
  } catch (e) { }

  // Calculate real performance overview from grades
  const termCount = parseInt(termStructure) || 3;
  const terms = Array.from({ length: termCount }, (_, i) => `term${i + 1}`);

  const performanceData = terms.map((t, index) => {
    const termGrades = studentReports.length > 0
      ? studentReports.flatMap(s => (s.classes || []).flatMap((c: any) => (c.grades || []).filter((g: any) => g.term === t)))
      : [];

    const avg = termGrades.length > 0
      ? Math.round(termGrades.reduce((acc, g) => acc + (g.marks || 0), 0) / termGrades.length)
      : 0;

    const top = termGrades.length > 0
      ? Math.max(...termGrades.map(g => g.marks || 0))
      : 0;

    const termLabel = termCount === 12
      ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]
      : `Term ${index + 1}`;

    return { name: termLabel, avg, top };
  }).filter(d => (d.avg > 0 || d.top > 0) || termCount < 5); // Show all if terms are few, otherwise filter empty months

  // Calculate real attendance trend by month
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const attendanceRecords = studentReports.flatMap(s => (s.classes || []).flatMap((c: any) => c.attendances || []));

  const attendanceTrendData = monthNames.map((month, index) => {
    const monthRecords = attendanceRecords.filter(a => a.date && new Date(a.date).getMonth() === index);
    const totalCount = monthRecords.length;
    const presentCount = monthRecords.filter(a => a.status === "PRESENT" || a.status === "present").length;
    const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

    return { month, rate };
  }).filter(d => d.rate > 0);

  let teacherClasses: any[] = []
  try {
    teacherClasses = await prisma.class.findMany({
      where: { teacherId: session.user.id },
      select: { id: true, name: true, subject: true }
    })
  } catch (err) {
    console.error("Failed to fetch classes for reports", err)
    teacherClasses = [];
  }

  return (
    <TeacherReportsManager
      initialPerformanceData={performanceData}
      initialAttendanceTrendData={attendanceTrendData}
      initialStudentReports={studentReports}
      initialClasses={teacherClasses}
    />
  )
}
