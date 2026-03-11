import * as z from "zod";

export const studentSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    rollNo: z.string().min(1, { message: "Roll number is required." }),
    classId: z.string().min(1, { message: "Please select a class." }),
    dob: z.string().min(1, { message: "Please select date of birth." }),
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    nationality: z.string().optional(),
    admissionDate: z.string().optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
    guardianEmail: z.string().optional(),
    guardianRelation: z.string().optional(),
    guardianOccupation: z.string().optional(),
    address: z.string().min(5, { message: "Address must be at least 5 characters." }),
    imageUrl: z.string().optional(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[!@#$%^&*]/, { message: "Password must contain at least one special character." })
        .optional()
        .or(z.literal("")),
});

export type StudentFormValues = z.infer<typeof studentSchema>;

export interface Student extends StudentFormValues {
    id: string;
    image?: string;
    enrollmentDate?: string;
}
