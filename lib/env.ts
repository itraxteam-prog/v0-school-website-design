import { z } from "zod";

const emptyToUndefined = z.preprocess((v) => (v === "" ? undefined : v), z.string().optional());

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),
    ENCRYPTION_KEY: z.string().min(32),
    CSRF_SECRET: z.string().min(1).optional(),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().int().positive(),
    SMTP_USER: z.string().email(),
    SMTP_PASS: z.string().min(1),
    SMTP_FROM: z.string().min(1).refine((val) => {
        const match = val.match(/<([^>]+)>/);
        const email = match ? match[1] : val;
        return z.string().email().safeParse(email).success;
    }, { message: "Invalid SMTP_FROM format. Use 'email@example.com' or 'Name <email@example.com>'" }),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
    SENTRY_DSN: z.string().url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = (() => {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        // Detect if we are in a build environment where some secrets might be missing
        const isBuildTime = 
            process.env.NEXT_PHASE === "phase-production-build" || 
            process.env.VERCEL === "1" || 
            process.env.CI === "true";

        console.error("❌ CRITICAL: Missing or invalid required environment variables:");
        result.error.issues.forEach(issue => {
            console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
        });

        if (isBuildTime) {
            console.warn("⚠️ Warning: Missing environment variables during build. This is usually fine as long as they are provided at runtime.");
            // Return process.env cast to the schema type to allow the build to proceed
            return process.env as unknown as z.infer<typeof envSchema>;
        }

        throw new Error("Missing required environment variables. System cannot boot.");
    }

    return result.data;
})();


export function validateEnv() {
    // This function is just a trigger to ensure the 'env' constant is evaluated
    return env;
}
