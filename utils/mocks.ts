export const MOCK_USERS = [
  {
    id: "1",
    name: "Dr. Ahmad Raza",
    email: "admin@school.com",
    role: "admin",
    status: "Active",
    last_login: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    email: "teacher@school.com",
    role: "teacher",
    status: "Active",
    last_login: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Ahmed Khan",
    email: "student@school.com",
    role: "student",
    status: "Active",
    last_login: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const MOCK_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Annual Sports Day 2026",
    message: "We are excited to announce our Annual Sports Day on March 15th. All students are encouraged to participate in at least one event. Registration forms are available in the PE office.",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    audience: ["student", "all"],
  },
  {
    id: "ann-2",
    title: "Mid-Term Examination Schedule",
    message: "The mid-term examination schedule has been posted on the notice board and sent to student emails. Exams begin on Feb 25th. Please ensure you have your library clearances ready.",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    audience: ["student", "teacher", "all"],
  },
  {
    id: "ann-3",
    title: "New Faculty Meeting",
    message: "There will be a mandatory meeting for all faculty members this Friday at 3:00 PM in the conference room to discuss the upcoming curriculum changes.",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    audience: ["teacher"],
  },
  {
    id: "ann-4",
    title: "Building Maintenance Notice",
    message: "Maintenance work will be carried out in Wing B this weekend. Expect minor disruptions in water supply and electricity in that area.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    audience: ["all"],
  },
];

export const MOCK_UPCOMING_EVENTS = [
  { title: "Basketball Finals", date: "Feb 18", time: "02:00 PM", location: "Gym A" },
  { title: "Drama Club Play", date: "Feb 22", time: "05:30 PM", location: "Auditorium" },
  { title: "Career Fair", date: "Feb 25", time: "09:00 AM", location: "Main Hall" },
];

export const MOCK_STUDENT_DASHBOARD_DATA = {
  stats: {
    performance: "88%",
    attendance: "94%",
    totalSubjects: 8,
    assignments: 3,
  },
  recentGrades: [
    { sub: "Mathematics", type: "Mid Term", date: "2026-02-15", marks: "92/100", grade: "A" },
    { sub: "Physics", type: "Quiz", date: "2026-02-12", marks: "18/20", grade: "A" },
    { sub: "Chemistry", type: "Assignment", date: "2026-02-10", marks: "85/100", grade: "A-" },
    { sub: "English", type: "Test", date: "2026-02-05", marks: "78/100", grade: "B+" },
    { sub: "Comp Science", type: "Project", date: "2026-02-01", marks: "95/100", grade: "A+" },
  ],
  upcomingEvents: [
    { title: "Sports Day", type: "Event", date: "Feb 25, 2026" },
    { title: "Physics Lab Exam", type: "Exam", date: "Mar 02, 2026" },
    { title: "Spring Break", type: "Holiday", date: "Mar 15, 2026" },
  ],
};

export const MOCK_TEACHER_DASHBOARD_DATA = {
  stats: {
    totalClasses: 5,
    totalStudents: 142,
    attendanceToday: "96%",
    pendingGrades: 34,
  },
  schedule: [
    { time: "08:30 - 09:30", class: "Grade 10-A", subject: "Advanced Mathematics", room: "Room 204" },
    { time: "09:30 - 10:30", class: "Grade 11-B", subject: "Pre-Calculus", room: "Room 305" },
    { time: "10:30 - 11:00", class: "Free Period", subject: "-", room: "Staff Room" },
    { time: "11:00 - 12:00", class: "Grade 9-A", subject: "Foundation Math", room: "Room 102" },
  ],
  classes: [
    { name: "Grade 10-A", subject: "Advanced Mathematics", students: 32 },
    { name: "Grade 11-B", subject: "Pre-Calculus", students: 28 },
    { name: "Grade 9-A", subject: "Foundation Math", students: 30 },
  ],
};
