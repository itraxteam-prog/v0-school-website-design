import { AttendanceManager } from "@/components/portal/attendance-manager"

export default async function TeacherAttendancePage() {
  // Baseline Mock Data for Teacher Classes
  const classes = [
    { id: "c1", name: "10-A (Mathematics)" },
    { id: "c2", name: "10-B (Algebra)" },
    { id: "c3", name: "9-A (General Science)" },
  ];

  return <AttendanceManager initialClasses={classes} />
}
