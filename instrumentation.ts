import * as Sentry from "@sentry/nextjs";
import { validateEnv } from "@/lib/env";

export async function register() {
    // Validate environment variables at boot
    const validatedEnv = validateEnv();

    if (process.env.NEXT_RUNTIME === "nodejs") {
        Sentry.init({
            dsn: validatedEnv.SENTRY_DSN,
            tracesSampleRate: 1.0,
            debug: false,
            environment: validatedEnv.NODE_ENV,
        });
    }

    if (process.env.NEXT_RUNTIME === "edge") {
        Sentry.init({
            dsn: validatedEnv.SENTRY_DSN,
            tracesSampleRate: 1.0,
            debug: false,
            environment: validatedEnv.NODE_ENV,
        });
    }
}

