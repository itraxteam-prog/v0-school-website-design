import * as Sentry from "@sentry/nextjs";

export async function register() {
    if (process.env.NODE_ENV === "production" && !process.env.SENTRY_DSN) {
        throw new Error("Missing SENTRY_DSN - error tracking required in production");
    }

    if (process.env.NEXT_RUNTIME === "nodejs") {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            tracesSampleRate: 1.0,
        });
    }

    if (process.env.NEXT_RUNTIME === "edge") {
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
            tracesSampleRate: 1.0,
        });
    }
}

