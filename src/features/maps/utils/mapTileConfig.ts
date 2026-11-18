export interface TileLayerConfig {
    url: string;
    attribution: string;
    maxZoom: number;
}

export const getTileLayerConfig = (
    cartoApiKey?: string | null,
    isDarkMode = false
): TileLayerConfig => {
    const cleanKey = cartoApiKey?.trim();

    if (cleanKey) {
        return {
            url: isDarkMode
                ? `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key=${cleanKey}`
                : `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${cleanKey}`,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>',
            maxZoom: 20,
        };
    }

    return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
    };
};
