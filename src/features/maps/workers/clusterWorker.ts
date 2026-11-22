import type {MapPoint} from '../types/mapData.ts';
import {clusterPointsInGrid, filterPointsByBounds, type ClusterBucket, type GeoBounds} from '../utils/viewportBounds.ts';

export interface ClusterWorkerRequest {
    requestId: number;
    points: MapPoint[];
    bounds: GeoBounds | null;
    zoom: number;
}

export interface ClusterWorkerResponse {
    requestId: number;
    clusters: ClusterBucket[];
}

self.onmessage = (event: MessageEvent<ClusterWorkerRequest>) => {
    const {requestId, points, bounds, zoom} = event.data;
    const visiblePoints = filterPointsByBounds(points, bounds);
    const clusters = clusterPointsInGrid(visiblePoints, zoom);
    const response: ClusterWorkerResponse = {requestId, clusters};
    self.postMessage(response);
};
