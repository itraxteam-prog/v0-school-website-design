import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
});

const studentLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"),
    analytics: true,
    prefix: "ratelimit:pdf:student",
});

const teacherLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "ratelimit:pdf:teacher",
});

const adminLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    analytics: true,
    prefix: "ratelimit:pdf:admin",
});

export async function checkExportRateLimit(userId: string, role: string) {
    let result;

    if (role === "ADMIN") {
        result = await adminLimiter.limit(userId);
    } else if (role === "TEACHER") {
        result = await teacherLimiter.limit(userId);
    } else {
        result = await studentLimiter.limit(userId);
    }

    if (!result.success) {
        throw new Error("PDF export rate limit exceeded. Please wait.");
    }
}
