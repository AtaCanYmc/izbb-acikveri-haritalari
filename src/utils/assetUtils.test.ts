import {describe, expect, it} from 'vitest';
import {resolveAssetUrl} from './assetUtils.ts';

describe('resolveAssetUrl', () => {
    it('returns empty string for empty input', () => {
        expect(resolveAssetUrl('')).toBe('');
    });

    it('returns external URLs as-is', () => {
        expect(resolveAssetUrl('https://example.com/image.png')).toBe('https://example.com/image.png');
        expect(resolveAssetUrl('http://example.com/image.png')).toBe('http://example.com/image.png');
        expect(resolveAssetUrl('data:image/svg+xml;base64,...')).toBe('data:image/svg+xml;base64,...');
    });

    it('prepends BASE_URL cleanly without duplicate slashes', () => {
        const url = resolveAssetUrl('logo.svg');
        expect(url).toContain('logo.svg');
        expect(url).not.toContain('//logo.svg');

        const urlWithSlash = resolveAssetUrl('/images/categories/saglik.svg');
        expect(urlWithSlash).toContain('images/categories/saglik.svg');
        expect(urlWithSlash).not.toContain('//images');
    });
});
