import { ProfileView } from "@/components/portal/profile-view"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TEACHER_SIDEBAR } from "@/lib/navigation-config"

export default async function TeacherProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "TEACHER") return null

  let teacher: any = null;
  try {
    teacher = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        taughtClasses: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch teacher profile", error);
  }

  if (!teacher) {
    // Return a safe fallback UI or redirect
    const fallbackData = {
      name: session.user.name || "Teacher",
      email: session.user.email || "",
      designation: "Faculty Member",
      id: `T-${session.user.id.slice(0, 4)}`.toUpperCase(),
      status: "ACTIVE",
      dob: "Not Specified",
      gender: "Not Specified",
      qualifications: "M.A. / M.Sc.",
      subjects: "General Academics",
      classes: "None assigned",
      joiningDate: new Date().toLocaleDateString(),
      phone: "Not provided",
      address: "Not provided",
      avatarUrl: session.user.image
    };
    return <ProfileView data={fallbackData} sidebarItems={TEACHER_SIDEBAR} userRole="teacher" />
  }

  const teacherData = {
    name: teacher.name || "Teacher",
    email: teacher.email || "teacher@school.edu",
    designation: teacher.profile?.gender || "Senior Faculty",
    id: teacher.profile?.rollNumber || `T-${teacher.id.slice(0, 4)}`.toUpperCase(),
    status: teacher.status,
    dob: teacher.profile?.dateOfBirth ? new Date(teacher.profile.dateOfBirth).toLocaleDateString() : "Not Specified",
    gender: teacher.profile?.gender || "Not Specified",
    qualifications: teacher.profile?.academicHistory ? String(teacher.profile.academicHistory) : "M.A. / M.Sc.",
    subjects: teacher.taughtClasses?.map((c: any) => c.subject).filter(Boolean).join(", ") || "General Academics",
    classes: teacher.taughtClasses?.map((c: any) => c.name).join(", ") || "None assigned",
    joiningDate: teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : "Not Specified",
    phone: teacher.profile?.phone || "Not provided",
    address: teacher.profile?.address || "Not provided",
    avatarUrl: teacher.image
  };

  return <ProfileView data={teacherData} sidebarItems={TEACHER_SIDEBAR} userRole="teacher" />
}
