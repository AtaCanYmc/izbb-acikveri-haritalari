import type {MapPoint} from '../types/mapData.ts';

export interface GeoBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

export interface ClusterBucket {
    id: string;
    latitude: number;
    longitude: number;
    count: number;
    pointIds: string[];
    samplePoint: MapPoint;
}

export const WORKER_CLUSTER_THRESHOLD = 2000;

/**
 * Filters map points to those within the visible map viewport bounds plus a small padding buffer.
 */
export const filterPointsByBounds = (
    points: MapPoint[],
    bounds: GeoBounds | null,
    paddingRatio = 0.15,
): MapPoint[] => {
    if (!bounds) {
        return points;
    }

    const latPad = Math.max(0.002, (bounds.north - bounds.south) * paddingRatio);
    const lngPad = Math.max(0.002, (bounds.east - bounds.west) * paddingRatio);

    const minLat = bounds.south - latPad;
    const maxLat = bounds.north + latPad;
    const minLng = bounds.west - lngPad;
    const maxLng = bounds.east + lngPad;

    return points.filter(
        (point) =>
            point.latitude >= minLat &&
            point.latitude <= maxLat &&
            point.longitude >= minLng &&
            point.longitude <= maxLng,
    );
};

/**
 * Fast O(n) spatial grid clustering for heavy datasets (> 2,000 points), safe to run inside a WebWorker.
 */
export const clusterPointsInGrid = (points: MapPoint[], zoom: number): ClusterBucket[] => {
    if (points.length === 0) {
        return [];
    }

    // At high zoom levels, show individual points directly
    if (zoom >= 15) {
        return points.map((point) => ({
            id: point.id,
            latitude: point.latitude,
            longitude: point.longitude,
            count: 1,
            pointIds: [point.id],
            samplePoint: point,
        }));
    }

    // Cell size in degrees scales inversely with zoom level
    const cellSize = 180 / Math.pow(2, Math.max(1, zoom) + 2);
    const grid = new Map<string, { latSum: number; lngSum: number; pointIds: string[]; samplePoint: MapPoint }>();

    for (const point of points) {
        const cellX = Math.floor(point.longitude / cellSize);
        const cellY = Math.floor(point.latitude / cellSize);
        const key = `${cellX}:${cellY}`;

        const existing = grid.get(key);
        if (existing) {
            existing.latSum += point.latitude;
            existing.lngSum += point.longitude;
            existing.pointIds.push(point.id);
        } else {
            grid.set(key, {
                latSum: point.latitude,
                lngSum: point.longitude,
                pointIds: [point.id],
                samplePoint: point,
            });
        }
    }

    const clusters: ClusterBucket[] = [];
    grid.forEach((cell, key) => {
        const count = cell.pointIds.length;
        clusters.push({
            id: count === 1 ? cell.samplePoint.id : `cluster-${key}`,
            latitude: cell.latSum / count,
            longitude: cell.lngSum / count,
            count,
            pointIds: cell.pointIds,
            samplePoint: cell.samplePoint,
        });
    });

    return clusters;
};
