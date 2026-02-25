import { z } from "zod";

const emptyToUndefined = z.preprocess((v) => (v === "" ? undefined : v), z.string().optional());

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url().optional(),
    CSRF_SECRET: z.string().min(1).optional(),
    SMTP_HOST: z.preprocess((v) => (v === "" ? undefined : v), z.string().optional()),
    SMTP_PORT: z.preprocess((v) => (v === "" ? undefined : v), z.string().transform((v) => (v ? parseInt(v, 10) : undefined)).optional()),
    SMTP_USER: z.preprocess((v) => (v === "" ? undefined : v), z.string().optional()),
    SMTP_PASS: z.preprocess((v) => (v === "" ? undefined : v), z.string().optional()),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
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
