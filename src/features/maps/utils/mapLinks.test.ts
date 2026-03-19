import { describe, it, expect } from 'vitest';
import { createGoogleMapsUrl, createPhoneUrl } from './mapLinks.ts';

describe('mapLinks', () => {
  describe('createGoogleMapsUrl', () => {
    it('should create valid Google Maps URL with coordinates', () => {
      const url = createGoogleMapsUrl(38.4237, 27.1428);
      expect(url).toBe('https://www.google.com/maps?q=38.4237,27.1428');
    });

    it('should handle positive coordinates', () => {
      const url = createGoogleMapsUrl(40.7128, 74.006);
      expect(url).toContain('40.7128');
      expect(url).toContain('74.006');
      expect(url).toBe('https://www.google.com/maps?q=40.7128,74.006');
    });

    it('should handle negative coordinates', () => {
      const url = createGoogleMapsUrl(-33.8688, 151.2093);
      expect(url).toContain('-33.8688');
      expect(url).toContain('151.2093');
    });

    it('should start with Google Maps domain', () => {
      const url = createGoogleMapsUrl(38.4237, 27.1428);
      expect(url).toMatch(/^https:\/\/www\.google\.com\/maps/);
    });

    it('should format coordinates correctly', () => {
      const url = createGoogleMapsUrl(38.4237, 27.1428);
      expect(url).toMatch(/\?q=\d+\.\d+,\d+\.\d+/);
    });

    it('should handle zero coordinates', () => {
      const url = createGoogleMapsUrl(0, 0);
      expect(url).toBe('https://www.google.com/maps?q=0,0');
    });

    it('should handle large decimal values', () => {
      const url = createGoogleMapsUrl(38.423789123, 27.142856789);
      expect(url).toContain('38.423789123');
      expect(url).toContain('27.142856789');
    });
  });

  describe('createPhoneUrl', () => {
    it('should create valid tel: URL', () => {
      const url = createPhoneUrl('0232 1234567');
      expect(url).toBe('tel:02321234567');
    });

    it('should remove all whitespace from phone number', () => {
      const url = createPhoneUrl('0232 123 4567');
      expect(url).toBe('tel:02321234567');
    });

    it('should handle phone numbers with dashes', () => {
      const url = createPhoneUrl('0232-123-4567');
      expect(url).toBe('tel:0232-123-4567');
    });

    it('should start with tel: protocol', () => {
      const url = createPhoneUrl('02321234567');
      expect(url).toMatch(/^tel:/);
    });

    it('should handle phone numbers with parentheses', () => {
      const url = createPhoneUrl('(0232) 1234567');
      expect(url).toBe('tel:(0232)1234567');
    });

    it('should handle phone numbers with plus sign', () => {
      const url = createPhoneUrl('+90 232 123 4567');
      expect(url).toBe('tel:+902321234567');
    });

    it('should remove multiple spaces', () => {
      const url = createPhoneUrl('0232   1234567');
      expect(url).toBe('tel:02321234567');
    });

    it('should handle international format', () => {
      const url = createPhoneUrl('+90 (232) 123 45 67');
      expect(url).toBe('tel:+90(232)1234567');
    });
  });

  describe('URL integration', () => {
    it('should create valid URLs that can be opened', () => {
      const mapsUrl = createGoogleMapsUrl(38.4237, 27.1428);
      const phoneUrl = createPhoneUrl('02321234567');

      expect(() => new URL(mapsUrl)).not.toThrow();
      expect(() => new URL(phoneUrl)).not.toThrow();
    });
  });
});

