import { ReportsManager } from "@/components/portal/reports-manager"

export default async function AdminReportsPage() {
  const data = {
    studentPerformance: [
      { rollNo: "2025-0142", name: "Ahmed Khan", attendance: "94%", grade: "A", remarks: "Excellent" },
      { rollNo: "2025-0143", name: "Sara Ali", attendance: "98%", grade: "A+", remarks: "Outstanding" },
      { rollNo: "2025-0144", name: "Hamza Butt", attendance: "89%", grade: "B+", remarks: "Improving" },
      { rollNo: "2025-0145", name: "Fatima Noor", attendance: "92%", grade: "A", remarks: "Very Good" },
      { rollNo: "2025-0146", name: "Bilal Shah", attendance: "85%", grade: "B", remarks: "Satisfactory" },
    ],
    teacherPerformance: [
      { name: "Mr. Usman Sheikh", classes: "10-A, 10-B", grade: "A-", attendance: "96%" },
      { name: "Dr. Ayesha Siddiqui", classes: "9-A, 10-A", grade: "A", attendance: "98%" },
      { name: "Ms. Nadia Jamil", classes: "8-A, 9-A", grade: "B+", attendance: "94%" },
      { name: "Mr. Bilal Ahmed", classes: "10-B, 11-A", grade: "A-", attendance: "92%" },
    ],
    attendanceChart: [
      { day: "Mon", attendance: 95 },
      { day: "Tue", attendance: 93 },
      { day: "Wed", attendance: 96 },
      { day: "Thu", attendance: 92 },
      { day: "Fri", attendance: 94 },
    ]
  };

  return <ReportsManager initialData={data} />
}
