import {beforeEach, describe, expect, it} from 'vitest';
import type {MapPoint} from '../types/mapData.ts';
import {getFrequentMapIds, readCachedMapPoints, recordMapView, writeCachedMapPoints} from './offlineCache.ts';

class MemoryStorage implements Storage {
    private store = new Map<string, string>();
    get length() {
        return this.store.size;
    }
    clear() {
        this.store.clear();
    }
    getItem(key: string) {
        return this.store.get(key) ?? null;
    }
    key(index: number) {
        return Array.from(this.store.keys())[index] ?? null;
    }
    removeItem(key: string) {
        this.store.delete(key);
    }
    setItem(key: string, value: string) {
        this.store.set(key, value);
    }
}

const samplePoints: MapPoint[] = [
    {
        id: 'p1',
        type: 'eczane',
        title: 'Test Eczanesi',
        latitude: 38.4237,
        longitude: 27.1428,
        detailLines: [],
        actions: [],
    },
];

describe('offlineCache', () => {
    beforeEach(() => {
        Object.defineProperty(globalThis, 'localStorage', {
            value: new MemoryStorage(),
            configurable: true,
        });
    });

    it('writes and reads fresh cached map points and supports stale offline fallback', () => {
        writeCachedMapPoints('nobetci-eczaneler', samplePoints);
        expect(readCachedMapPoints('nobetci-eczaneler')).toEqual(samplePoints);
        expect(readCachedMapPoints('nobetci-eczaneler', {ttlMs: -1})).toBeNull();
        expect(readCachedMapPoints('nobetci-eczaneler', {ttlMs: -1, allowStale: true})).toEqual(samplePoints);
    });

    it('tracks frequently viewed categories in descending order', () => {
        recordMapView('otoparklar');
        recordMapView('nobetci-eczaneler');
        recordMapView('nobetci-eczaneler');
        recordMapView('wizmirnet');
        recordMapView('nobetci-eczaneler');
        recordMapView('otoparklar');

        expect(getFrequentMapIds(2)).toEqual(['nobetci-eczaneler', 'otoparklar']);
    });
});
