import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

// Sensitive fields to mask
const sensitiveFields = [
    "password",
    "token",
    "secret",
    "apiKey",
    "email", // Sometimes email is sensitive, but often needed for debugging. Masking just in case.
    "authorization",
    "cookie",
    "set-cookie",
];

export const logger = pino({
    level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },
    base: isProduction ? { env: "production" } : undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
        paths: sensitiveFields.flatMap((field) => [
            field,
            `*.${field}`,
            `*.*.${field}`,
        ]),
        censor: "[REDACTED]",
    },
    transport: isProduction || typeof window !== "undefined"
        ? undefined
        : {
            target: "pino-pretty",
            options: {
                colorize: true,
                ignore: "pid,hostname",
            },
        },
});

// Helper to log requests
export function logRequest(req: Request | any, context?: string) {
    const url = req.url || "unknown";
    const method = req.method || "unknown";

    logger.info({
        method,
        url,
        context,
        timestamp: new Date().toISOString(),
    }, "Incoming Request");
}
