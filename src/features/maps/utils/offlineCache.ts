import type {MapPoint} from '../types/mapData.ts';

const CACHE_PREFIX = 'izbb-map-cache:';
const FREQ_KEY = 'izbb-map-freq';
const MAX_CACHED_DATASETS = 8;
const DEFAULT_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

interface CachedDataset {
    updatedAt: number;
    points: MapPoint[];
}

const getStorage = (): Storage | null => {
    if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
        return null;
    }
    try {
        return globalThis.localStorage;
    } catch {
        return null;
    }
};

const readFrequencyMap = (storage: Storage): Record<string, number> => {
    try {
        const raw = storage.getItem(FREQ_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return parsed as Record<string, number>;
        }
    } catch {
        // ignore corrupted frequency map
    }
    return {};
};

export const recordMapView = (mapId: string): void => {
    const storage = getStorage();
    if (!storage) return;
    const freq = readFrequencyMap(storage);
    freq[mapId] = (Object.hasOwn(freq, mapId) ? freq[mapId] : 0) + 1;
    try {
        storage.setItem(FREQ_KEY, JSON.stringify(freq));
    } catch {
        // quota exceeded
    }
};

export const getFrequentMapIds = (limit = 5): string[] => {
    const storage = getStorage();
    if (!storage) return [];
    const freq = readFrequencyMap(storage);
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id]) => id);
};

export const readCachedMapPoints = (
    mapId: string,
    {allowStale = false, ttlMs = DEFAULT_TTL_MS}: { allowStale?: boolean; ttlMs?: number } = {},
): MapPoint[] | null => {
    const storage = getStorage();
    if (!storage) return null;

    try {
        const raw = storage.getItem(`${CACHE_PREFIX}${mapId}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as CachedDataset;
        if (!Array.isArray(parsed?.points) || typeof parsed?.updatedAt !== 'number') {
            return null;
        }
        const isFresh = Date.now() - parsed.updatedAt <= ttlMs;
        if (!isFresh && !allowStale) {
            return null;
        }
        return parsed.points;
    } catch {
        return null;
    }
};

export const writeCachedMapPoints = (mapId: string, points: MapPoint[]): void => {
    const storage = getStorage();
    if (!storage) return;

    const payload: CachedDataset = {
        updatedAt: Date.now(),
        points,
    };

    try {
        // Evict least-frequently viewed cached maps if over cap
        const cachedKeys: string[] = [];
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key && key.startsWith(CACHE_PREFIX)) {
                cachedKeys.push(key);
            }
        }

        if (cachedKeys.length >= MAX_CACHED_DATASETS && !cachedKeys.includes(`${CACHE_PREFIX}${mapId}`)) {
            const freq = readFrequencyMap(storage);
            cachedKeys.sort((a, b) => {
                const idA = a.slice(CACHE_PREFIX.length);
                const idB = b.slice(CACHE_PREFIX.length);
                const countA = Object.hasOwn(freq, idA) ? freq[idA] : 0;
                const countB = Object.hasOwn(freq, idB) ? freq[idB] : 0;
                return countA - countB;
            });
            const toRemove = cachedKeys.slice(0, cachedKeys.length - MAX_CACHED_DATASETS + 1);
            toRemove.forEach((key) => storage.removeItem(key));
        }

        storage.setItem(`${CACHE_PREFIX}${mapId}`, JSON.stringify(payload));
    } catch {
        // Storage quota exceeded — fail silently without blocking map render
    }
};
