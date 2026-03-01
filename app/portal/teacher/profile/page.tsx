import { TeacherProfileView } from "@/components/portal/teacher-profile-view"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function TeacherProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "TEACHER") return null

  const teacher = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      taughtClasses: true,
    },
  });

  if (!teacher) return <div>Teacher not found</div>

  const teacherData = {
    name: teacher.name || "Teacher",
    email: teacher.email || "teacher@school.edu",
    designation: teacher.profile?.gender || "Senior Faculty",
    id: teacher.profile?.rollNumber || `T-${teacher.id.slice(0, 4)}`.toUpperCase(),
    status: teacher.status,
    dob: teacher.profile?.dateOfBirth ? teacher.profile.dateOfBirth.toLocaleDateString() : "Not Specified",
    gender: teacher.profile?.gender || "Not Specified",
    qualifications: teacher.profile?.academicHistory || "M.A. / M.Sc.",
    subjects: teacher.taughtClasses.map(c => c.subject).filter(Boolean).join(", ") || "General Academics",
    classes: teacher.taughtClasses.map(c => c.name).join(", ") || "None assigned",
    joiningDate: teacher.createdAt.toLocaleDateString(),
    phone: teacher.profile?.phone || "Not provided",
    address: teacher.profile?.address || "Not provided",
  };

  return <TeacherProfileView teacherData={teacherData} />
}
