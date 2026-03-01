/**
 * Ensures that the execution happens in the Node.js runtime.
 * Prevents PDF generation failures on Edge runtime.
 */
export function assertNodeRuntime() {
    if (process.env.NEXT_RUNTIME === "edge") {
        throw new Error("PDF exports must run in the Node.js runtime");
    }
}
