import { z, ZodSchema } from "zod";
import { NextApiRequest, NextApiResponse } from "next";

// ---------- Centralized Validator ----------
export function validateRequest<T extends ZodSchema>(
    schema: T,
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        return schema.parse(req.body);
    } catch (error) {
        // Return 400 and null to satisfy "if (!data) return" check in the handler
        res.status(400).json({ error: (error as any).errors || error });
        return null;
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
