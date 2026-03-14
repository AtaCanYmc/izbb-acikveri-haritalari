import {useCallback, useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";
import type {MapDefinition, MapPoint} from "../types/mapData.ts";
import {useLocationPermission} from "./useLocationPermission.ts";

const matchesSearch = (point: MapPoint, searchTerm: string) => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('tr-TR');

    if (!normalizedSearch) {
        return true;
    }

    const haystack = [
        point.title,
        point.subtitle,
        point.description,
        point.badge,
        ...point.detailLines,
    ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('tr-TR');

    return haystack.includes(normalizedSearch);
};

export const useOpenDataMapPage = (mapDefinition: MapDefinition) => {
    const [points, setPoints] = useState<MapPoint[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const locationPermission = useLocationPermission();

    const loadPoints = useCallback(async () => {
        try {
            setLoading(true);
            const nextPoints = await mapDefinition.loadPoints();
            setPoints(nextPoints);
            setSelectedPoint((current) => current ?? nextPoints[0] ?? null);
            toast.success(`${mapDefinition.title} verileri güncellendi`);
        } catch (error) {
            console.error(`${mapDefinition.id} verileri yüklenemedi`, error);
            toast.error('Harita verileri alınamadı. Lütfen daha sonra tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    }, [mapDefinition]);

    useEffect(() => {
        void loadPoints();
    }, [loadPoints]);

    const filteredPoints = useMemo(() => {
        return points.filter((point) => matchesSearch(point, searchTerm));
    }, [points, searchTerm]);

    useEffect(() => {
        if (!selectedPoint) {
            return;
        }

        const stillExists = filteredPoints.some((point) => point.id === selectedPoint.id);

        if (!stillExists) {
            setSelectedPoint(filteredPoints[0] ?? null);
        }
    }, [filteredPoints, selectedPoint]);

    return {
        points: filteredPoints,
        searchTerm,
        setSearchTerm,
        selectedPoint,
        setSelectedPoint,
        loading,
        isSidebarOpen,
        setIsSidebarOpen,
        ...locationPermission,
    };
};

