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
const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    analytics: true,
    prefix: "ratelimit",
});

export type RateLimitResponse = {
    success: boolean;
    limit: number;
    remaining: number;
};

/**
 * Core rate limit function for production auth routes.
 * 
 * @param identifier - Unique string for the client (usually IP)
 * @param bucket - The specific action being limited for prefixing
 */
export async function rateLimit(
    identifier: string,
    bucket: "login" | "register" | "reset" | "mutation"
): Promise<RateLimitResponse> {
    const { success, limit, remaining } = await limiter.limit(`${bucket}:${identifier}`);

    return {
        success,
        limit,
        remaining,
    };
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
