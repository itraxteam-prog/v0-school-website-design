type RateLimitRecord = {
    count: number;
    timestamp: number;
};

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // per IP per window

const memoryStore = new Map<string, RateLimitRecord>();

export function rateLimit(ip: string) {
    const now = Date.now();
    const record = memoryStore.get(ip);

    if (!record) {
        memoryStore.set(ip, { count: 1, timestamp: now });
        return true;
    }

    if (now - record.timestamp > RATE_LIMIT_WINDOW) {
        memoryStore.set(ip, { count: 1, timestamp: now });
        return true;
    }

    if (record.count >= MAX_REQUESTS) {
        return false;
    }

    record.count++;
    return true;
}
