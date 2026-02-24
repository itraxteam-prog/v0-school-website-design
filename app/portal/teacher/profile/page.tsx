import { TeacherProfileView } from "@/components/portal/teacher-profile-view"

export default async function TeacherProfilePage() {
  // Baseline Mock Data
  const teacherData = {
    name: "Usman Sheikh",
    designation: "Senior Mathematics Teacher",
    id: "TCH-0042",
    status: "Active",
    dob: "12th October 1985",
    gender: "Male",
    qualifications: "M.Sc. Mathematics, B.Ed",
    subjects: "Mathematics, Physics",
    classes: "Grade 10-A, Grade 9-A",
    joiningDate: "15th August 2018",
    email: "usman.sheikh@pioneershigh.edu",
    phone: "+92 300 9876543",
    address: "House #123, Block-A, Gulberg III, Lahore",
  };

  return <TeacherProfileView teacherData={teacherData} />
}
