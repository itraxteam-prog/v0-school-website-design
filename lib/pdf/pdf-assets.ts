import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs";

/**
 * Fetches the school logo from dynamic settings or a local fallback.
 * Returns a Base64 data URI string suitable for @react-pdf/renderer.
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

        // 2. Fallback to high-quality local logo
        const fallbackPath = path.join(process.cwd(), "public", "images", "logo.png");
        if (fs.existsSync(fallbackPath)) {
            const buffer = fs.readFileSync(fallbackPath);
            const base64 = buffer.toString("base64");
            return `data:image/png;base64,${base64}`;
        }

        // 3. Absolute final fallback (placeholder if everything else fails)
        const placeholderPath = path.join(process.cwd(), "public", "placeholder-logo.png");
        if (fs.existsSync(placeholderPath)) {
            const buffer = fs.readFileSync(placeholderPath);
            const base64 = buffer.toString("base64");
            return `data:image/png;base64,${base64}`;
        }

        return "";
    } catch (error) {
        console.error("[getSchoolLogo] Error retrieving logo:", error);
        return "";
    }
}
