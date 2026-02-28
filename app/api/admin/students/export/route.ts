export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { requireRole, handleAuthError } from "@/lib/auth-guard";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await requireRole("ADMIN");
        const { searchParams } = new URL(req.url);
        const format = searchParams.get("format") || "csv";

        const students = await prisma.user.findMany({
            where: { role: "STUDENT" },
            include: { 
                profile: true,
                classes: { take: 1 }
            },
            orderBy: { name: "asc" }
        });

        if (format === "csv") {
            const headers = ["ID", "Name", "Email", "Roll Number", "Class", "Date of Birth", "Guardian Phone", "Address"];
            const rows = students.map(s => [
                s.id,
                s.name || "",
                s.email || "",
                s.profile?.rollNumber || "",
                s.classes[0]?.name || "N/A",
                s.profile?.dateOfBirth?.toLocaleDateString() || "",
                s.profile?.guardianPhone || "",
                s.profile?.address || ""
            ]);


            const csvContent = [
                headers.join(","),
                ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
            ].join("\n");

            return new Response(csvContent, {
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename=students-export-${Date.now()}.csv`
                }
            });
        }

        return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
    } catch (error) {
        return handleAuthError(error);
    }
}

