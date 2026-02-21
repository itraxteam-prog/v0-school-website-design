import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/portal/login");
    }

    if (session.user.role !== "TEACHER") {
        redirect("/portal/403");
    }

    return <>{children}</>;
}
