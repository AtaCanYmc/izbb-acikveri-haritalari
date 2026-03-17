import {useCallback, useEffect, useMemo, useState} from "react";
import {getMapDefinitionById} from "../config/mapRegistry.ts";

const MAP_QUERY_PARAM = 'map';

const readMapIdFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(MAP_QUERY_PARAM);
};

const writeMapIdToUrl = (mapId: string | null) => {
    const searchParams = new URLSearchParams(window.location.search);
    if (mapId) {
        searchParams.set(MAP_QUERY_PARAM, mapId);
    } else {
        searchParams.delete(MAP_QUERY_PARAM);
    }
    window.location.href = `${window.location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}${window.location.hash}`;
};

export const useMapQueryParam = () => {
    const [activeMapId, setActiveMapId] = useState<string | null>(readMapIdFromUrl);

    useEffect(() => {
        const syncWithBrowserNavigation = () => {
            setActiveMapId(readMapIdFromUrl());
        };

        window.addEventListener('popstate', syncWithBrowserNavigation);
        return () => window.removeEventListener('popstate', syncWithBrowserNavigation);
    }, []);

    const activeMap = useMemo(() => {
        if (!activeMapId) return null;
        return getMapDefinitionById(activeMapId);
    }, [activeMapId]);

    const setMapId = useCallback((mapId: string | null) => {
        writeMapIdToUrl(mapId);
        setActiveMapId(mapId);
    }, []);

    return {
        activeMap,
        activeMapId: activeMap?.id ?? null,
        setMapId,
    };
};
