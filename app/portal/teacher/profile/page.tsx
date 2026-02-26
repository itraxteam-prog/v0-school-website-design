import { TeacherProfileView } from "@/components/portal/teacher-profile-view"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function TeacherProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) return null

  // Baseline Mock Data merged with session data
  const teacherData = {
    name: session.user.name || "Teacher",
    email: session.user.email || "teacher@school.edu",
    designation: "Senior Faculty",
    id: `T-${session.user.id.slice(0, 4)}`.toUpperCase(),
    status: "Active",
    dob: "Not Specified",
    gender: "Not Specified",
    qualifications: "M.A. / M.Sc.",
    subjects: "General Academics",
    classes: "Grade 10, Grade 9",
    joiningDate: "August 2020",
    phone: "+92 3XX XXXXXXX",
    address: "Not provided",
  };

  return <TeacherProfileView teacherData={teacherData} />
}
