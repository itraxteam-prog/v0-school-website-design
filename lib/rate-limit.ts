import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "./env";

/**
 * Upstash Redis instance initialized with verified environment variables.
 */
const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
});

/**
 * Distributed rate limiter using sliding window algorithm.
 * Configured for 10 requests per 60 seconds.
 */
const loginLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 per minute
    analytics: true,
    prefix: "ratelimit:login",
});

const registerLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 per 10 minutes
    analytics: true,
    prefix: "ratelimit:register",
});

const passwordResetLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "15 m"), // 3 per 15 minutes
    analytics: true,
    prefix: "ratelimit:password-reset",
});

const announcementLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 per minute
    analytics: true,
    prefix: "ratelimit:announcement",
});

const attendanceLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"), // 60 per minute
    analytics: true,
    prefix: "ratelimit:attendance",
});

const generalLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "60 s"),
    analytics: true,
    prefix: "ratelimit:general",
});

export type RateLimitResponse = {
    success: boolean;
    limit: number;
    remaining: number;
};

export type RateLimitBucket =
    | "login"
    | "register"
    | "password-reset-request"
    | "announcement-create"
    | "attendance-submit"
    | "mutation"
    | "reset" // backwards compatibility
    | "announcement" // backwards compatibility
    | "attendance"; // backwards compatibility

/**
 * Core rate limit function for production routes.
 * 
 * @param identifier - Unique string for the client (usually IP)
 * @param bucket - The specific action being limited
 */
export async function rateLimit(
    identifier: string,
    bucket: RateLimitBucket
): Promise<RateLimitResponse> {
    try {
        let result;

        switch (bucket) {
            case "login":
                result = await loginLimiter.limit(identifier);
                break;
            case "register":
                result = await registerLimiter.limit(identifier);
                break;
            case "password-reset-request":
            case "reset":
                result = await passwordResetLimiter.limit(identifier);
                break;
            case "announcement-create":
            case "announcement":
                result = await announcementLimiter.limit(identifier);
                break;
            case "attendance-submit":
            case "attendance":
                result = await attendanceLimiter.limit(identifier);
                break;
            default:
                result = await generalLimiter.limit(`${bucket}:${identifier}`);
        }

        return {
            success: result.success,
            limit: result.limit,
            remaining: result.remaining,
        };
    } catch (error) {
        console.error("Rate limit error (permitting request):", error);
        // Fail-open: allow request if rate limiter is down
        return {
            success: true,
            limit: 10,
            remaining: 9,
        };
    }
}

/**
 * Helper to extract IP from request headers for Next.js App Router
 */
export function getIP(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    return "127.0.0.1";
}

/**
 * Helper to extract IP from NextApiRequest for Pages Router
 */
import { NextApiRequest } from "next";
export function getPagesIP(req: NextApiRequest): string {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
        return (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(",")[0].trim();
    }
    return req.socket.remoteAddress || "127.0.0.1";
}
