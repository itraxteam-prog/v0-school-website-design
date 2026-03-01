import { renderToBuffer } from "@react-pdf/renderer";
import { ReactElement } from "react";

/**
 * Renders a @react-pdf/renderer Document element server-side and returns
 * the result as an ArrayBuffer, which is natively compatible with
 * NextResponse BodyInit.
 * Must be called server-side only (Node.js runtime).
 */
export async function createPdf(element: ReactElement): Promise<ArrayBuffer> {
    const uint8 = await renderToBuffer(element);
    // Copy into a fresh ArrayBuffer to avoid SharedArrayBuffer type ambiguity
    const buffer = new ArrayBuffer(uint8.byteLength);
    new Uint8Array(buffer).set(uint8);
    return buffer;
}
