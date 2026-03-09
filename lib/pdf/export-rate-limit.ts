import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

const redis = (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN)
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

const studentLimiter = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"),
    analytics: true,
    prefix: "ratelimit:pdf:student",
}) : null;

const teacherLimiter = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "ratelimit:pdf:teacher",
}) : null;

const adminLimiter = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    analytics: true,
    prefix: "ratelimit:pdf:admin",
}) : null;

export async function checkExportRateLimit(userId: string, role: string) {
    if (!redis) {
        console.warn("Redis not configured – skipping rate limit for PDF export.");
        return;
    }

    let result;

    if (role === "ADMIN") {
        result = await adminLimiter!.limit(userId);
    } else if (role === "TEACHER") {
        result = await teacherLimiter!.limit(userId);
    } else {
        result = await studentLimiter!.limit(userId);
    }

    if (!result.success) {
        throw new Error("PDF export rate limit exceeded. Please wait.");
    }
}
