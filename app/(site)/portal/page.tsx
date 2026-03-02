import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export default async function PortalPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/portal/login");
    }

    const role = session.user.role.toLowerCase();
    redirect(`/portal/${role}`);
}
