import { requireAuth } from "@/lib/auth-guard";
import { redirect } from "next/navigation";

export default async function LegacySecurityPage() {
    const session = await requireAuth();
    const role = session.user.role.toLowerCase();
    // Permanently redirect to the role-specific security page
    redirect(`/portal/${role}/security`);
}
