import { requireRole } from "@/lib/auth-guard";

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireRole("TEACHER");

    return <>{children}</>;
}
