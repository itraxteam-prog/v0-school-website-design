import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/portal/login");
    }

    if (session.user.role !== "STUDENT") {
        redirect("/portal/403");
    }

    return <>{children}</>;
}
