import { describe, it, expect } from 'vitest';
import { formatDate } from './dateUtils.ts';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format valid date string correctly', () => {
      const result = formatDate('2024-03-20T10:30:00');
      expect(result).toBeTruthy();
      expect(result).toContain('20');
      expect(result).toContain('03');
      expect(result).toContain('2024');
    });

    it('should format date with Turkish locale', () => {
      const result = formatDate('2024-01-15T14:45:00');
      // Should contain day, month, year, hour and minute (Turkish format uses . separator)
      expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
    });

    it('should include time in the output', () => {
      const result = formatDate('2024-03-20T10:30:00');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('should return "Geçersiz Tarih" for invalid date string', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Geçersiz Tarih');
    });

    it('should return "Geçersiz Tarih" for empty string', () => {
      const result = formatDate('');
      expect(result).toBe('Geçersiz Tarih');
    });

    it('should return "Geçersiz Tarih" for null-like strings', () => {
      const result = formatDate('null');
      expect(result).toBe('Geçersiz Tarih');
    });

    it('should format different valid dates correctly', () => {
      const dates = [
        '2024-01-01T00:00:00',
        '2023-12-31T23:59:59',
        '2024-06-15T12:00:00',
      ];

      dates.forEach((date) => {
        const result = formatDate(date);
        expect(result).not.toBe('Geçersiz Tarih');
        expect(result).toBeTruthy();
      });
    });

    it('should handle ISO format dates', () => {
      const isoDate = '2024-03-20T10:30:00Z';
      const result = formatDate(isoDate);
      expect(result).not.toBe('Geçersiz Tarih');
      expect(result).toBeTruthy();
    });

    it('should handle dates without time component', () => {
      const dateOnly = '2024-03-20';
      const result = formatDate(dateOnly);
      expect(result).toBeTruthy();
      expect(result).toContain('2024');
    });
  });
});

