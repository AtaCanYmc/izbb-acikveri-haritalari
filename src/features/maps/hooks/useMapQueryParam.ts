import {useCallback, useEffect, useMemo, useState} from "react";
import {defaultMapId, getMapDefinitionById} from "../config/mapRegistry.ts";

const MAP_QUERY_PARAM = 'map';

const readMapIdFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(MAP_QUERY_PARAM) ?? defaultMapId;
};

const writeMapIdToUrl = (mapId: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(MAP_QUERY_PARAM, mapId);
    const nextUrl = `${window.location.pathname}?${searchParams.toString()}${window.location.hash}`;
    window.history.pushState({}, '', nextUrl);
};

export const useMapQueryParam = () => {
    const [activeMapId, setActiveMapId] = useState(readMapIdFromUrl);

    useEffect(() => {
        const syncWithBrowserNavigation = () => {
            setActiveMapId(readMapIdFromUrl());
        };

        window.addEventListener('popstate', syncWithBrowserNavigation);
        return () => window.removeEventListener('popstate', syncWithBrowserNavigation);
    }, []);

    const activeMap = useMemo(() => {
        return getMapDefinitionById(activeMapId);
    }, [activeMapId]);

    const setMapId = useCallback((mapId: string) => {
        writeMapIdToUrl(mapId);
        setActiveMapId(mapId);
    }, []);

    return {
        activeMap,
        activeMapId: activeMap.id,
        setMapId,
    };
};
