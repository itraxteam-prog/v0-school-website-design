"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        logger.error(error, "Global Error");
    }, [error]);

    return (
        <html>
            <body className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Critical Error</h2>
                <p className="mb-6">
                    A critical error occurred that prevented the application from loading.
                </p>
                <button
                    onClick={() => reset()}
                    className="px-4 py-2 bg-black text-white rounded-md"
                >
                    Reload Application
                </button>
            </body>
        </html>
    );
}
