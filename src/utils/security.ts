/**
 * Security utilities for XSS prevention, safe URL sanitization,
 * and safe JSON serialization.
 */

/**
 * Escapes HTML control characters to prevent DOM-based XSS when rendering strings into HTML.
 */
export const escapeHtml = (str: unknown): string => {
    if (str === null || str === undefined) {
        return '';
    }
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

/**
 * Sanitizes URLs to prevent javascript: or data: URI execution.
 * Allows safe protocols: http:, https:, tel:, mailto:, or relative paths.
 */
export const sanitizeUrl = (url: string | null | undefined, fallback = '#'): string => {
    if (!url) {
        return fallback;
    }

    const trimmed = url.trim();
    // Strip whitespace and control characters to prevent scheme obfuscation
    // eslint-disable-next-line no-control-regex
    const cleanUrl = trimmed.replace(/[\x00-\x20\x7F-\x9F\s]/g, '');

    if (!cleanUrl) {
        return fallback;
    }

    // Reject protocol-relative URLs (//example.com)
    if (cleanUrl.startsWith('//')) {
        return fallback;
    }

    // Allow explicit safe protocols or safe relative URLs
    const isSafeProtocol = /^(?:https?|tel|mailto):/i.test(cleanUrl);
    const isSafeRelative = /^(?:\/|\.\.?\/|#|\?)/.test(cleanUrl);

    if (!isSafeProtocol && !isSafeRelative) {
        return fallback;
    }

    return trimmed;
};

/**
 * Safely serializes data into JSON for safe interpolation inside <script> tags.
 * Escapes characters that could terminate script tags or break HTML parsing.
 */
export const safeJsonStringify = (data: unknown): string => {
    const serialized = JSON.stringify(data);
    if (serialized === undefined) {
        return 'null';
    }
    return serialized
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
};
