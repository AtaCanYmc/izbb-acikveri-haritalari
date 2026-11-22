export const createGoogleMapsUrl = (latitude: number, longitude: number) => {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
};

export const createPhoneUrl = (phone: string) => {
    return `tel:${phone.replace(/\s+/g, '')}`;
};

export type TravelMode = 'driving' | 'walking' | 'transit';

export const createDirectionsUrl = (
    latitude: number,
    longitude: number,
    travelMode: TravelMode = 'driving',
    origin?: [number, number] | null,
) => {
    const params = new URLSearchParams({
        api: '1',
        destination: `${latitude},${longitude}`,
        travelmode: travelMode,
    });
    if (origin) {
        params.set('origin', `${origin[0]},${origin[1]}`);
    }
    return `https://www.google.com/maps/dir/?${params.toString()}`;
};

export const createTransitUrl = (latitude: number, longitude: number, origin?: [number, number] | null) => {
    return createDirectionsUrl(latitude, longitude, 'transit', origin);
};

export const createWalkingUrl = (latitude: number, longitude: number, origin?: [number, number] | null) => {
    return createDirectionsUrl(latitude, longitude, 'walking', origin);
};

/**
 * Haversine distance in kilometers between two geographic coordinates.
 */
export const calculateDistanceKm = (
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
): number => {
    const EARTH_RADIUS_KM = 6371;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(toLat - fromLat);
    const dLng = toRad(toLng - fromLng);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export interface TravelEstimates {
    distanceLabel: string;
    walkingMinutes: number;
    transitMinutes: number;
    drivingMinutes: number;
}

export const estimateTravelTimes = (distanceKm: number): TravelEstimates => {
    const safeKm = Math.max(0, distanceKm);
    const distanceLabel = safeKm < 1
        ? `${Math.round(safeKm * 1000)} m`
        : `${safeKm.toFixed(1)} km`;

    return {
        distanceLabel,
        walkingMinutes: Math.max(1, Math.round((safeKm / 4.8) * 60)),
        transitMinutes: Math.max(3, Math.round((safeKm / 20) * 60) + 4),
        drivingMinutes: Math.max(1, Math.round((safeKm / 35) * 60)),
    };
};

