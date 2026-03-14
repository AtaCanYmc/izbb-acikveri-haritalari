import type {MapPoint, MapPointAction} from "../types/mapData.ts";

interface BaseMapPointInput {
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    subtitle?: string;
    description?: string;
    badge?: string;
    detailLines?: string[];
    actions?: MapPointAction[];
}

export const createMapPoint = (input: BaseMapPointInput): MapPoint => {
    return {
        id: input.id,
        title: input.title,
        subtitle: input.subtitle,
        description: input.description,
        latitude: input.latitude,
        longitude: input.longitude,
        badge: input.badge,
        detailLines: input.detailLines ?? [],
        actions: input.actions ?? [],
    };
};

export const isValidCoordinate = (latitude: number, longitude: number) => {
    return Number.isFinite(latitude) && Number.isFinite(longitude);
};

export const buildMapPointId = (...parts: Array<string | number>) => {
    return parts.join('-');
};

