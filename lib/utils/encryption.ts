import crypto from "crypto";
import { env } from "@/lib/env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a string using AES-256-GCM.
 * The encryption key should be exactly 32 bytes (256 bits).
 */
export function encrypt(text: string): string {
    const key = Buffer.from(process.env.ENCRYPTION_KEY || "fallback_key_at_least_32_bytes_long_!!", "utf8").slice(0, 32);
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Store IV and AuthTag with the encrypted content
    return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

/**
 * Decrypts a string encrypted with AES-256-GCM.
 */
export function decrypt(encryptedText: string): string {
    try {
        const key = Buffer.from(process.env.ENCRYPTION_KEY || "fallback_key_at_least_32_bytes_long_!!", "utf8").slice(0, 32);
        const data = Buffer.from(encryptedText, "base64");

        const iv = data.slice(0, IV_LENGTH);
        const authTag = data.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
        const encrypted = data.slice(IV_LENGTH + AUTH_TAG_LENGTH);

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString("utf8");
    } catch (error) {
        console.error("Decryption failed:", error);
        // If decryption fails, return the original text as fallback (for legacy plain-text data)
        // In a strict environment, you might throw here instead.
        return encryptedText;
    }
}
