import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export default async function PortalPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/portal/login?error=SessionExpired");
    }

    const role = (session.user.role as string)?.toUpperCase();

    switch (role) {
        case "ADMIN":
            redirect("/portal/admin");
        case "TEACHER":
            redirect("/portal/teacher");
        case "STUDENT":
            redirect("/portal/student");
        case "PARENT":
            redirect("/portal/parent");
        default:
            redirect("/portal/login?error=InvalidRole");
    }
}

