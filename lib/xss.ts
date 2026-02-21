import xss from "xss";

export function sanitizeHtml(html: string) {
    return xss(html);
}

// For use in React components where we want to render safely but don't want to use dangerouslySetInnerHTML
// This is mostly for completeness as React already escapes strings.
export function safeText(text: string) {
    return xss(text);
}
