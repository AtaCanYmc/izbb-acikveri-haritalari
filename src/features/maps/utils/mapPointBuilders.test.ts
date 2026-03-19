import { describe, it, expect } from 'vitest';
import { createMapPoint, isValidCoordinate, buildMapPointId } from './mapPointBuilders.ts';

describe('mapPointBuilders', () => {
  describe('createMapPoint', () => {
    it('should create a map point with required fields', () => {
      const input = {
        id: 'test-1',
        title: 'Test Location',
        latitude: 38.4237,
        longitude: 27.1428,
      };

      const point = createMapPoint(input);

      expect(point.id).toBe('test-1');
      expect(point.title).toBe('Test Location');
      expect(point.latitude).toBe(38.4237);
      expect(point.longitude).toBe(27.1428);
    });

    it('should include optional fields when provided', () => {
      const input = {
        id: 'test-2',
        title: 'Test Location',
        latitude: 38.4237,
        longitude: 27.1428,
        subtitle: 'Subtitle Text',
        description: 'Description Text',
        badge: 'Badge Text',
        detailLines: ['Detail 1', 'Detail 2'],
        actions: [
          {
            id: 'action-1',
            label: 'Open',
            href: 'https://example.com',
          },
        ],
      };

      const point = createMapPoint(input);

      expect(point.subtitle).toBe('Subtitle Text');
      expect(point.description).toBe('Description Text');
      expect(point.badge).toBe('Badge Text');
      expect(point.detailLines).toEqual(['Detail 1', 'Detail 2']);
      expect(point.actions).toHaveLength(1);
      expect(point.actions?.[0]?.label).toBe('Open');
    });

    it('should provide empty arrays for optional fields when not provided', () => {
      const input = {
        id: 'test-3',
        title: 'Test Location',
        latitude: 38.4237,
        longitude: 27.1428,
      };

      const point = createMapPoint(input);

      expect(point.detailLines).toEqual([]);
      expect(point.actions).toEqual([]);
    });

    it('should preserve all coordinate precision', () => {
      const input = {
        id: 'test-5',
        title: 'Test Location',
        latitude: 38.42370123456789,
        longitude: 27.14285678901234,
      };

      const point = createMapPoint(input);

      expect(point.latitude).toBe(38.42370123456789);
      expect(point.longitude).toBe(27.14285678901234);
    });
  });

  describe('isValidCoordinate', () => {
    it('should return true for valid coordinates', () => {
      expect(isValidCoordinate(38.4237, 27.1428)).toBe(true);
      expect(isValidCoordinate(0, 0)).toBe(true);
      expect(isValidCoordinate(-33.8688, 151.2093)).toBe(true);
    });

    it('should return false for NaN values', () => {
      expect(isValidCoordinate(NaN, 27.1428)).toBe(false);
      expect(isValidCoordinate(38.4237, NaN)).toBe(false);
      expect(isValidCoordinate(NaN, NaN)).toBe(false);
    });

    it('should return false for Infinity values', () => {
      expect(isValidCoordinate(Infinity, 27.1428)).toBe(false);
      expect(isValidCoordinate(38.4237, Infinity)).toBe(false);
      expect(isValidCoordinate(-Infinity, 27.1428)).toBe(false);
    });

    it('should return true for very small decimal values', () => {
      expect(isValidCoordinate(0.0001, 0.0001)).toBe(true);
      expect(isValidCoordinate(-0.0001, -0.0001)).toBe(true);
    });

    it('should return true for large coordinate values', () => {
      expect(isValidCoordinate(89.9999, 179.9999)).toBe(true);
      expect(isValidCoordinate(-89.9999, -179.9999)).toBe(true);
    });
  });

  describe('buildMapPointId', () => {
    it('should build ID from string parts', () => {
      const id = buildMapPointId('location', 'istanbul');
      expect(id).toBe('location-istanbul');
    });

    it('should build ID from mixed string and number parts', () => {
      const id = buildMapPointId('map', 123, 'point');
      expect(id).toBe('map-123-point');
    });

    it('should build ID from multiple parts', () => {
      const id = buildMapPointId('prefix', 'middle', 'suffix', 'end');
      expect(id).toBe('prefix-middle-suffix-end');
    });

    it('should create unique IDs for different inputs', () => {
      const id1 = buildMapPointId('eczane', 'Istanbul', 38.4237, 27.1428);
      const id2 = buildMapPointId('eczane', 'Ankara', 38.4237, 27.1428);
      const id3 = buildMapPointId('hastane', 'Istanbul', 38.4237, 27.1428);

      expect(id1).not.toBe(id2);
      expect(id1).not.toBe(id3);
      expect(id2).not.toBe(id3);
    });
  });
});

