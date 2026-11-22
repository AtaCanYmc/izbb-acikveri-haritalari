import {describe, expect, it} from 'vitest';
import {escapeHtml, sanitizeUrl, safeJsonStringify} from './security.ts';

describe('security utils', () => {
    describe('escapeHtml', () => {
        it('handles null, undefined, and non-string types safely', () => {
            expect(escapeHtml(null)).toBe('');
            expect(escapeHtml(undefined)).toBe('');
            expect(escapeHtml(1234)).toBe('1234');
        });

        it('escapes dangerous HTML characters', () => {
            const raw = '<script>alert("XSS & \'hack\'")</script>';
            const escaped = escapeHtml(raw);
            expect(escaped).toBe('&lt;script&gt;alert(&quot;XSS &amp; &#39;hack&#39;&quot;)&lt;/script&gt;');
            expect(escaped).not.toContain('<');
            expect(escaped).not.toContain('>');
        });
    });

    describe('sanitizeUrl', () => {
        it('returns fallback for empty or null URLs', () => {
            expect(sanitizeUrl('')).toBe('#');
            expect(sanitizeUrl(null)).toBe('#');
            expect(sanitizeUrl(undefined, '')).toBe('');
        });

        it('permits safe URLs', () => {
            expect(sanitizeUrl('https://example.com/test')).toBe('https://example.com/test');
            expect(sanitizeUrl('http://localhost:5173')).toBe('http://localhost:5173');
            expect(sanitizeUrl('tel:+902321234567')).toBe('tel:+902321234567');
            expect(sanitizeUrl('mailto:test@example.com')).toBe('mailto:test@example.com');
            expect(sanitizeUrl('/relative/path')).toBe('/relative/path');
        });

        it('blocks javascript: and dangerous URI schemes', () => {
            expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
            expect(sanitizeUrl('JAVASCRIPT:alert(1)')).toBe('#');
            expect(sanitizeUrl('javascript :alert(1)')).toBe('#');
            expect(sanitizeUrl('data:text/html;base64,...')).toBe('#');
            expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('#');
            expect(sanitizeUrl('file:///etc/passwd')).toBe('#');
            expect(sanitizeUrl('blob:https://example.com/uuid')).toBe('#');
            expect(sanitizeUrl('//evil.example/path')).toBe('#');
        });
    });

    describe('safeJsonStringify', () => {
        it('escapes < and > to prevent </script> injection', () => {
            const payload = {title: '</script><script>alert("XSS")</script>'};
            const json = safeJsonStringify(payload);
            expect(json).not.toContain('</script>');
            expect(json).toContain('\\u003c/script\\u003e');
        });

        it('handles non-serializable top-level values safely', () => {
            expect(safeJsonStringify(undefined)).toBe('null');
            expect(safeJsonStringify(() => {})).toBe('null');
        });
    });
});
