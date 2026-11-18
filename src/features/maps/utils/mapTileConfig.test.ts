import {describe, expect, it} from 'vitest';
import {getTileLayerConfig} from './mapTileConfig.ts';

describe('getTileLayerConfig', () => {
    it('returns free OpenStreetMap when API key is undefined', () => {
        const config = getTileLayerConfig(undefined);
        expect(config.url).toBe('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
        expect(config.attribution).toContain('OpenStreetMap');
        expect(config.attribution).not.toContain('CARTO');
        expect(config.maxZoom).toBe(19);
    });

    it('returns free OpenStreetMap when API key is empty or whitespace', () => {
        const configEmpty = getTileLayerConfig('');
        expect(configEmpty.url).toBe('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

        const configWhitespace = getTileLayerConfig('   ');
        expect(configWhitespace.url).toBe('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    });

    it('returns CARTO Voyager when API key is provided in light mode', () => {
        const config = getTileLayerConfig('my-carto-key', false);
        expect(config.url).toBe('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=my-carto-key');
        expect(config.attribution).toContain('CARTO');
        expect(config.maxZoom).toBe(20);
    });

    it('returns CARTO Dark All when API key is provided in dark mode', () => {
        const config = getTileLayerConfig('my-carto-key', true);
        expect(config.url).toBe('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key=my-carto-key');
        expect(config.attribution).toContain('CARTO');
        expect(config.maxZoom).toBe(20);
    });
});
