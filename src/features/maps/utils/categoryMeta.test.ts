import {describe, expect, it} from 'vitest';
import {getCategoryConfig, CATEGORY_CONFIGS} from './categoryMeta.ts';

describe('categoryMeta', () => {
    it('returns exact config for known categories', () => {
        const saglik = getCategoryConfig('Sağlık');
        expect(saglik.name).toBe('Sağlık');
        expect(saglik.iconUrl).toContain('images/categories/saglik.svg');
        expect(saglik.badgeClass).toContain('emerald');

        const ulasim = getCategoryConfig('Ulaşım');
        expect(ulasim.name).toBe('Ulaşım');
        expect(ulasim.iconUrl).toContain('images/categories/ulasim.svg');

        const afet = getCategoryConfig('Afet');
        expect(afet.name).toBe('Afet');
        expect(afet.iconUrl).toContain('images/categories/afet.svg');
    });

    it('returns default config for unknown category', () => {
        const unknown = getCategoryConfig('Bilinmeyen Kategori');
        expect(unknown.name).toBe('Bilinmeyen Kategori');
        expect(unknown.iconUrl).toBeDefined();
        expect(unknown.accentColor).toBeDefined();
    });

    it('has configs for all 11 registered categories', () => {
        const registered = [
            'Sağlık', 'Ulaşım', 'Afet', 'Dijital Hizmetler', 'Eğitim',
            'Kültür', 'Rekreasyon', 'Tarih', 'Yaşam', 'Yönetim', 'Belediye'
        ];

        for (const cat of registered) {
            expect(CATEGORY_CONFIGS[cat]).toBeDefined();
            expect(CATEGORY_CONFIGS[cat].iconUrl).toContain('.svg');
        }
    });
});
