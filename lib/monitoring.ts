import * as Sentry from "@sentry/nextjs";
import type { NextApiHandler } from "next";
import { logger } from "./logger";

export function withErrorMonitoring(handler: NextApiHandler): NextApiHandler {
    return async (req, res) => {
        try {
            return await handler(req, res);
        } catch (error) {
            Sentry.captureException(error);
            logger.error(error, "Unhandled API error");
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
}
