import { z } from "zod";

const emptyToUndefined = z.preprocess((v) => (v === "" ? undefined : v), z.string().optional());

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url().optional().refine((val) => {
        if (process.env.NODE_ENV === "production" && !val) return false;
        return true;
    }, { message: "NEXTAUTH_URL is required in production" }),
    CSRF_SECRET: z.string().min(1).optional(),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().int().positive(),
    SMTP_USER: z.string().email(),
    SMTP_PASS: z.string().min(16),
    SMTP_FROM: z.string().min(1).refine((val) => {
        const match = val.match(/<([^>]+)>/);
        const email = match ? match[1] : val;
        return z.string().email().safeParse(email).success;
    }, { message: "Invalid SMTP_FROM format. Use 'email@example.com' or 'Name <email@example.com>'" }),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    SENTRY_DSN: z.string().url().optional().refine((val) => {
        if (process.env.NODE_ENV === "production" && !val) return false;
        return true;
    }, { message: "SENTRY_DSN is required in production" }),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = (() => {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error("❌ Invalid environment variables:", result.error.flatten().fieldErrors);
        throw new Error("Invalid environment variables. Fix them and restart the app.");
    }

    return result.data;
})();

export function validateEnv() {
    // This function is just a trigger to ensure the 'env' constant is evaluated
    return env;
}
