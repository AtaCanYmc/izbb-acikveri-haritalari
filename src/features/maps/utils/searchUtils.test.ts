import {describe, expect, it} from 'vitest';
import {normalizeTurkish, searchMaps} from './searchUtils.ts';
import type {MapDefinition} from '../types/mapData.ts';

const dummyMaps: MapDefinition[] = [
    {
        id: 'nobetci-eczaneler',
        title: 'Nöbetçi Eczaneler',
        category: 'Sağlık',
        description: 'İzmir genelindeki güncel nöbetçi eczaneleri harita üzerinde görün.',
        searchPlaceholder: 'Eczane ara...',
        emptyStateTitle: 'Eczane bulunamadı',
        emptyStateDescription: 'Tekrar deneyin',
        sourceLabel: 'İzBB',
        sourceUrl: 'https://example.com',
        loadPoints: async () => [],
    },
    {
        id: 'eczaneler',
        title: 'Tüm Eczaneler',
        category: 'Sağlık',
        description: 'İzmir genelindeki tüm eczaneler.',
        searchPlaceholder: 'Eczane ara...',
        emptyStateTitle: 'Eczane bulunamadı',
        emptyStateDescription: 'Tekrar deneyin',
        sourceLabel: 'İzBB',
        sourceUrl: 'https://example.com',
        loadPoints: async () => [],
    },
    {
        id: 'otoparklar',
        title: 'Otoparklar',
        category: 'Ulaşım',
        description: 'Otopark doluluk oranları ve konumları.',
        searchPlaceholder: 'Otopark ara...',
        emptyStateTitle: 'Otopark bulunamadı',
        emptyStateDescription: 'Tekrar deneyin',
        sourceLabel: 'İzBB',
        sourceUrl: 'https://example.com',
        loadPoints: async () => [],
    },
];

describe('searchUtils', () => {
    describe('normalizeTurkish', () => {
        it('normalizes Turkish accented letters to lowercase equivalents', () => {
            expect(normalizeTurkish('NÖBETÇİ ECZANELER')).toBe('nobetci eczaneler');
            expect(normalizeTurkish('İSTANBUL ve İZMİR')).toBe('istanbul ve izmir');
            expect(normalizeTurkish('Sağlık & Çevre')).toBe('saglik & cevre');
        });
    });

    describe('searchMaps', () => {
        it('matches exact title with different casing and accents', () => {
            const res1 = searchMaps(dummyMaps, 'Nöbetçi Eczaneler');
            expect(res1).toHaveLength(1);
            expect(res1[0].id).toBe('nobetci-eczaneler');

            const res2 = searchMaps(dummyMaps, 'nobetci');
            expect(res2).toHaveLength(1);
            expect(res2[0].id).toBe('nobetci-eczaneler');
        });

        it('matches multi-token queries regardless of token order', () => {
            const res = searchMaps(dummyMaps, 'eczane nobetci');
            expect(res).toHaveLength(1);
            expect(res[0].id).toBe('nobetci-eczaneler');
        });

        it('returns all matching maps for generic keywords', () => {
            const res = searchMaps(dummyMaps, 'eczane');
            expect(res).toHaveLength(2);
        });

        it('falls back to all categories if category filter would produce 0 results', () => {
            // Selected category is 'Ulaşım', but query is 'Nöbetçi Eczaneler'
            const res = searchMaps(dummyMaps, 'Nöbetçi Eczaneler', 'Ulaşım');
            expect(res).toHaveLength(1);
            expect(res[0].id).toBe('nobetci-eczaneler');
        });

        it('returns all maps when query is empty', () => {
            const res = searchMaps(dummyMaps, '');
            expect(res).toHaveLength(3);
        });
    });
});
