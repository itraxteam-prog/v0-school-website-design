/**
 * Escapes HTML special characters to prevent XSS when rendering plain text.
 * Used on both server and client as a safe fallback.
 */
function escapeHtml(input: string): string {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

/**
 * Sanitizes HTML to prevent XSS attacks.
 * - In the browser: uses DOMPurify for full HTML sanitization.
 * - On the server (SSR/prerender): falls back to HTML-escaping, which is
 *   safe for plain-text content. This avoids SSR build failures caused by
 *   browser-only DOMPurify internals being evaluated during static generation.
 */
export function sanitizeHtml(input: string): string {
    if (!input) return '';

    // Server-side: return safely escaped plain text
    if (typeof window === 'undefined') {
        return escapeHtml(input);
    }

    // Client-side: use DOMPurify for full sanitization
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const DOMPurify = require('isomorphic-dompurify');
    return DOMPurify.sanitize(input, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: [
            'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
            'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote',
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    }) as string;
}
