export interface MapPoint {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    latitude: number;
    longitude: number;
    detailLines: string[];
    badge?: string;
    actions?: MapPointAction[];
}

export interface MapPointAction {
    id: string;
    label: string;
    href: string;
    external?: boolean;
}

export interface MapDefinition {
    id: string;
    title: string;
    description: string;
    searchPlaceholder: string;
    emptyStateTitle: string;
    emptyStateDescription: string;
    sourceLabel: string;
    sourceUrl: string;
    loadPoints: () => Promise<MapPoint[]>;
}

