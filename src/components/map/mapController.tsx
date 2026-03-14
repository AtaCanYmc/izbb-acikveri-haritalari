import type {Eczane} from "../../types/eczane.ts";
import {useMap} from "react-leaflet";
import {useEffect} from "react";

const MapController = ({selectedEczane}: { selectedEczane: Eczane | null }) => {
    const map = useMap();

    // Sayfa ilk yüklendiğinde haritanın gri kalmasını (yanlış render) engeller
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [map]);

    // Seçili eczane değiştiğinde oraya pürüzsüz kay
    useEffect(() => {
        if (selectedEczane) {
            const lat = parseFloat(selectedEczane.LokasyonX);
            const lng = parseFloat(selectedEczane.LokasyonY);
            map.flyTo([lat, lng], 15, {animate: true, duration: 1.5});
        }
    }, [selectedEczane, map]);

    return null;
};

export default MapController;