import type {Eczane} from "../types/eczane.ts";

const BASE_URL = "https://openapi.izmir.bel.tr/api/ibb";

export const ApiEndpoints = {
    getNobetciEczaneler: () => `${BASE_URL}/nobetcieczaneler`,
    getEczaneler: () => `${BASE_URL}/eczaneler`,
};

export const fetchNobetciEczaneler = async (): Promise<Eczane[]> => {
    try {
        const response = await fetch(ApiEndpoints.getNobetciEczaneler());
        return handleResponse(response);
    } catch (error) {
        console.error("Nöbetçi eczaneler yüklenirken hata oluştu:", error);
        return [];
    }
};

export const fetchEczaneler = async (): Promise<Eczane[]> => {
    try {
        const response = await fetch(ApiEndpoints.getEczaneler());
        return handleResponse(response);
    } catch (error) {
        console.error("Eczaneler yüklenirken hata oluştu:", error);
        return [];
    }
};

export const handleResponse = (response: Response) => {
    if (!response.ok) {
        throw new Error(`Ağ hatası: ${response.status}`);
    }
    return response.json();
}

export const openEczaneOnMap = (eczane: Eczane) => {
    window.open(`https://www.google.com/maps?q=${eczane.LokasyonX},${eczane.LokasyonY}`)
};

export const callEczane = (eczane: Eczane) => {
    window.location.href = `tel:${eczane.Telefon}`;
};
