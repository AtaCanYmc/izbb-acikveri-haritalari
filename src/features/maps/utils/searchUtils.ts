import type {MapDefinition} from '../types/mapData.ts';

/**
 * Normalizes Turkish and English strings for accent-insensitive, case-insensitive search.
 */
export const normalizeTurkish = (str: string): string => {
    if (!str) return '';
    return str
        .toLocaleLowerCase('tr-TR')
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .trim();
};

/**
 * Filters a list of MapDefinitions using multi-token Turkish-aware search.
 * Matches across title, description, category, and ID.
 */
export const searchMaps = (
    maps: MapDefinition[],
    query: string,
    category = 'all'
): MapDefinition[] => {
    const cleanQuery = query.trim();
    const normalizedQuery = normalizeTurkish(cleanQuery);

    // If query is present and category filter yields zero results, we search across all categories
    const categoryFilter = (m: MapDefinition) => category === 'all' || m.category === category;

    if (!normalizedQuery) {
        return maps.filter(categoryFilter);
    }

    const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

    const matchesMap = (map: MapDefinition) => {
        const normTitle = normalizeTurkish(map.title);
        const normDesc = normalizeTurkish(map.description);
        const normCat = normalizeTurkish(map.category);
        const normId = normalizeTurkish(map.id.replace(/-/g, ' '));

        // Every search token must match at least one attribute of the map
        return tokens.every(
            (token) =>
                normTitle.includes(token) ||
                normDesc.includes(token) ||
                normCat.includes(token) ||
                normId.includes(token)
        );
    };

    // First try within selected category
    const categoryMatches = maps.filter((m) => categoryFilter(m) && matchesMap(m));

    // If category is not 'all' but produced 0 results, fall back to searching all categories
    if (category !== 'all' && categoryMatches.length === 0) {
        return maps.filter(matchesMap);
    }

    return categoryMatches;
};
