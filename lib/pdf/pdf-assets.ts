import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

/**
 * Fetches the school logo for use in @react-pdf/renderer.
 *
 * Priority order:
 *  1. DB value — accepts both base64 data URIs and https:// Cloudinary URLs
 *  2. Filesystem fallback — reads public/images/logo.png directly from disk
 *     as a base64 data URI (no network request, works on any runtime/host)
 *  3. Empty string — PDF renders without a logo rather than crashing
 */
export async function getSchoolLogo(): Promise<string> {
    try {
        // Tier 1: DB value (base64 data URI or Cloudinary https:// URL)
        const logoSetting = await prisma.setting.findUnique({
            where: { key: "schoolLogo" },
        });

        if (
            logoSetting?.value &&
            (logoSetting.value.startsWith("data:image") ||
                logoSetting.value.startsWith("https://"))
        ) {
            return logoSetting.value;
        }
    } catch (error) {
        console.error("[getSchoolLogo] DB lookup failed:", error);
    }

    try {
        // Tier 2: Read logo.png directly from the filesystem (no HTTP fetch)
        const logoPath = path.join(process.cwd(), "public", "images", "logo.png");
        const fileBuffer = fs.readFileSync(logoPath);
        return `data:image/png;base64,${fileBuffer.toString("base64")}`;
    } catch (error) {
        console.error("[getSchoolLogo] Filesystem fallback failed:", error);
    }

    // Tier 3: Degrade gracefully — render PDF without a logo
    return "";
}
