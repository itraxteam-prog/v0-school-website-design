import { prisma } from "@/lib/prisma";

/**
 * Fetches the school logo from dynamic settings or an absolute URL fallback.
 * Returns a Base64 data URI string or URL suitable for @react-pdf/renderer.
 */
export async function getSchoolLogo(): Promise<string> {
    try {
        // 1. Check for dynamic setting in database
        const logoSetting = await prisma.setting.findUnique({
            where: { key: "schoolLogo" }
        });

        if (logoSetting?.value && logoSetting.value.startsWith("data:image")) {
            return logoSetting.value;
        }

        // 2. Fallback to high-quality absolute URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
        return `${baseUrl}/images/logo.png`;
    } catch (error) {
        console.error("[getSchoolLogo] Error retrieving logo:", error);
        return "";
    }
}
