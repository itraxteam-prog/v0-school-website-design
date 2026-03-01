import { NextResponse } from "next/server";

/**
 * Centrally managed PDF response contract.
 * Enforces correct headers and download behavior.
 */
export function createPdfResponse(buffer: ArrayBuffer | Buffer, filename: string) {
    // Ensure we provide a valid BodyInit
    const body = buffer instanceof Buffer ? buffer : new Uint8Array(buffer);

    return new NextResponse(body as any, {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}.pdf"`,
            "Cache-Control": "no-store",
        },
    });
}

