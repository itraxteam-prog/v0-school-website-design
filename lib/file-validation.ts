import path from "path";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
];

export interface FileValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Validates a file for size and MIME type.
 * @param file - The file to validate
 */
export function validateFile(file: File): FileValidationResult {
    if (file.size > MAX_FILE_SIZE) {
        return { isValid: false, error: "File size exceeds 5MB limit" };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return { isValid: false, error: "Invalid file type. Only PDF and images are allowed." };
    }

    return { isValid: true };
}

/**
 * Sanitizes a filename to prevent directory traversal or malicious characters.
 * @param filename - Original filename
 */
export function sanitizeFilename(filename: string): string {
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);

    // Remove non-alphanumeric characters except hyphens and underscores
    const sanitizedName = name.replace(/[^a-z0-9_-]/gi, "_");

    // Return sanitized name with extension
    return `${sanitizedName}${ext}`.toLowerCase();
}
