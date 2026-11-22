import {describe, expect, it} from 'vitest';
import type {MapPoint} from '../types/mapData.ts';
import {clusterPointsInGrid, filterPointsByBounds, WORKER_CLUSTER_THRESHOLD} from './viewportBounds.ts';

const makePoint = (id: string, latitude: number, longitude: number): MapPoint => ({
    id,
    type: 'test',
    title: `Point ${id}`,
    latitude,
    longitude,
    detailLines: [],
    actions: [],
});

describe('viewportBounds', () => {
    it('filters out off-screen markers outside padded bounds', () => {
        const inside = makePoint('in', 38.42, 27.14);
        const outside = makePoint('out', 41.0, 29.0);
        const bounds = {north: 38.5, south: 38.3, east: 27.25, west: 27.05};

        const result = filterPointsByBounds([inside, outside], bounds, 0.1);
        expect(result.map((p) => p.id)).toEqual(['in']);
    });

    it('clusters heavy datasets (> 2,000 points) into fewer spatial buckets at low zoom', () => {
        const points: MapPoint[] = [];
        for (let i = 0; i < WORKER_CLUSTER_THRESHOLD + 500; i++) {
            const lat = 38.35 + (i % 50) * 0.004;
            const lng = 27.05 + Math.floor(i / 50) * 0.004;
            points.push(makePoint(`p-${i}`, lat, lng));
        }

        const clusters = clusterPointsInGrid(points, 11);
        const totalCount = clusters.reduce((sum, c) => sum + c.count, 0);

        expect(clusters.length).toBeLessThan(points.length);
        expect(totalCount).toBe(points.length);
    });

    it('returns individual points at high zoom (>= 15)', () => {
        const points = [makePoint('a', 38.42, 27.14), makePoint('b', 38.4201, 27.1401)];
        const clusters = clusterPointsInGrid(points, 15);
        expect(clusters).toHaveLength(2);
        expect(clusters.every((c) => c.count === 1)).toBe(true);
    });
});
