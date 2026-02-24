import { GradebookManager } from "@/components/portal/gradebook-manager"

export default async function TeacherGradeEntryPage() {
  // Baseline Mock Data for Prototype
  const classes = [
    { id: "c1", name: "10-A (Mathematics)" },
    { id: "c2", name: "10-B (Algebra)" },
    { id: "c3", name: "9-A (General Science)" },
  ];

  const subjects = [
    { id: "math", name: "Mathematics" },
    { id: "algb", name: "Algebra" },
    { id: "phys", name: "Physics" },
  ];

  return <GradebookManager initialClasses={classes} initialSubjects={subjects} />
}
