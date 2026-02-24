import { ClassesView } from "@/components/portal/classes-view"

export default async function TeacherClassesPage() {
  // Baseline Mock Data for Prototype
  const classes = [
    {
      id: "c1",
      name: "Mathematics 10-A",
      subject: "Advanced Mathematics",
      studentCount: 32,
      room: "Room 102",
      performance: 88,
      color: "from-blue-500/10 to-blue-500/5",
    },
    {
      id: "c2",
      name: "Algebra 10-B",
      subject: "Linear Algebra",
      studentCount: 28,
      room: "Room 104",
      performance: 82,
      color: "from-emerald-500/10 to-emerald-500/5",
    },
    {
      id: "c3",
      name: "General Science 9-A",
      subject: "Integrated Science",
      studentCount: 35,
      room: "Lab 01",
      performance: 75,
      color: "from-amber-500/10 to-amber-500/5",
    },
    {
      id: "c4",
      name: "Physics 11-A",
      subject: "Quantum Mechanics Intro",
      studentCount: 22,
      room: "Lab 03",
      performance: 92,
      color: "from-purple-500/10 to-purple-500/5",
    },
  ];

  return <ClassesView initialClasses={classes} />
}
