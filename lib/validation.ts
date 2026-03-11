import { NextRequest, NextResponse } from "next/server";

// ---------- Centralized Validator ----------
export async function validateRequest<T extends ZodSchema>(
    schema: T,
    req: NextRequest | NextApiRequest
): Promise<{ data: z.infer<T> | null; errorResponse?: NextResponse | null }> {
    try {
        let body;
        if ("json" in req && typeof req.json === "function") {
            body = await req.json();
        } else {
            body = (req as NextApiRequest).body;
        }

        const data = schema.parse(body);
        return { data, errorResponse: null };
    } catch (error) {
        const errorDetails = (error as any).errors || error;
        
        // If it's an App Router request, we return a pre-built NextResponse
        if ("json" in req && typeof req.json === "function") {
            return {
                data: null,
                errorResponse: NextResponse.json({ error: errorDetails, success: false }, { status: 400 })
            };
        }
        
        // For Pages Router, we can't easily return a response here without res object
        // So we return the error details for the handler to use
        return { data: null, errorResponse: errorDetails as any };
    }
}

// ---------- Zod Schemas ----------

// User (covers Student, Teacher, Admin roles)
export const userSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6), // hashed server-side if using create
    role: z.enum(["STUDENT", "TEACHER", "ADMIN"]),
    createdAt: z.preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
    updatedAt: z.preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
    classId: z.string().optional(), // for students
});

// Role schema
export const roleSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1),
    permissions: z.array(z.string()).optional(),
});
