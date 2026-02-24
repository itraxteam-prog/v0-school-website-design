import { TeacherReportsManager } from "@/components/portal/teacher-reports-manager"

export default async function TeacherReportsPage() {
  // Baseline Mock Data
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

  const studentReports = [
    { id: "S001", name: "Ahmed Khan", attendance: 95, avgGrade: 88, status: "Excellent" },
    { id: "S002", name: "Sara Ali", attendance: 98, avgGrade: 94, status: "Excellent" },
    { id: "S003", name: "Hamza Butt", attendance: 88, avgGrade: 76, status: "Good" },
    { id: "S004", name: "Fatima Noor", attendance: 92, avgGrade: 89, status: "Excellent" },
  ];

  return (
    <TeacherReportsManager
      initialPerformanceData={performanceData}
      initialAttendanceTrendData={attendanceTrendData}
      initialStudentReports={studentReports}
    />
  )
}
