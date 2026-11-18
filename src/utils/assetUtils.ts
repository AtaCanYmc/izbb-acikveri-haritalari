/**
 * Resolves static asset paths relative to Vite's configured BASE_URL.
 * Supports both base '/' (standard root) and '/<repo-name>/' (e.g. GitHub Pages).
 */
export const resolveAssetUrl = (path: string): string => {
    if (!path) {
        return '';
    }
    // Return external URLs as-is
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
    }

    const base = import.meta.env?.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    return `${cleanBase}${cleanPath}`;
};
