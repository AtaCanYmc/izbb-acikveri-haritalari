import {useMemo} from "react";
import {defaultMapId, getMapDefinitionById} from "../config/mapRegistry.ts";

const MAP_QUERY_PARAM = 'map';

export const useMapQueryParam = () => {
    const activeMap = useMemo(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const mapId = searchParams.get(MAP_QUERY_PARAM) ?? defaultMapId;
        return getMapDefinitionById(mapId);
    }, []);

    return activeMap;
};

