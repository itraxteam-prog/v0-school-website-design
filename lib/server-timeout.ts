import { logger } from "./logger";

/**
 * Wraps an async operation with a timeout.
 * If the operation exceeds the limit, it rejects with a timeout error.
 * 
 * @param promise The async operation to wrap
 * @param ms Timeout in milliseconds (default: 8000ms)
 * @param context context for logging (e.g., API route name)
 */
export async function withTimeout<T>(
    promise: Promise<T>,
    ms: number = 8000,
    context: string = "unknown"
): Promise<T> {
    let timeoutId: NodeJS.Timeout;

    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
            logger.warn({ context, timeoutMs: ms }, "Operation timed out");
            reject(new Error(`Operation timed out after ${ms}ms`));
        }, ms);
    });

    try {
        const result = await Promise.race([promise, timeoutPromise]);
        clearTimeout(timeoutId!);
        return result;
    } catch (error) {
        clearTimeout(timeoutId!);
        throw error;
    }
}
