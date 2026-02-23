
type RateLimitEntry = {
    count: number;
    resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

export type RateLimitResult = {
    success: boolean;
    remaining: number;
};

export const RATE_LIMIT_CONFIGS = {
    login: { limit: 5, windowMs: 5 * 60 * 1000 },
    'password-reset': { limit: 3, windowMs: 10 * 60 * 1000 },
    'admin-mutation': { limit: 20, windowMs: 60 * 1000 },
} as const;

/**
 * Memory-based rate limiter for Node logic.
 * Not for use in Middleware or Edge runtime.
 */
export function rateLimit(
    ip: string,
    route: keyof typeof RATE_LIMIT_CONFIGS
): RateLimitResult {
    const now = Date.now();
    const config = RATE_LIMIT_CONFIGS[route];
    const key = `${ip}:${route}`;

    const entry = store.get(key);

    // If entry doesn't exist or window expired, reset
    if (!entry || now > entry.resetAt) {
        const newEntry = {
            count: 1,
            resetAt: now + config.windowMs,
        };
        store.set(key, newEntry);
        return { success: true, remaining: config.limit - 1 };
    }

    // If limit reached
    if (entry.count >= config.limit) {
        return { success: false, remaining: 0 };
    }

    // Increment count
    entry.count += 1;
    return {
        success: true,
        remaining: config.limit - entry.count,
    };
}
