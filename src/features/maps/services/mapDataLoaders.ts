import type {Eczane} from "izmir-open-data-js/dist/endpoints/eczaneler";
import type {OtoparkBilgisi} from "izmir-open-data-js/dist/endpoints/otopark";
import type {DefaultOnemliYer} from "izmir-open-data-js/dist/common/types/onemliYer";
import {formatDate} from "../../../utils/dateUtils.ts";
import type {MapPoint, MapPointAction} from "../types/mapData.ts";
import {createGoogleMapsUrl, createPhoneUrl} from "../utils/mapLinks.ts";
import {buildMapPointId, createMapPoint, isValidCoordinate} from "../utils/mapPointBuilders.ts";
import {izmirOpenDataClient} from "./izmirOpenDataClient.ts";

const createRouteAction = (latitude: number, longitude: number) => ({
    id: 'route',
    label: 'Yol Tarifi',
    href: createGoogleMapsUrl(latitude, longitude),
    external: true,
});

const createPhoneAction = (phone?: string) => {
    if (!phone) {
        return null;
    }

    return {
        id: 'call',
        label: 'Ara',
        href: createPhoneUrl(phone),
    };
};

const mapEczane = (eczane: Eczane): MapPoint | null => {
    const latitude = Number.parseFloat(eczane.LokasyonX);
    const longitude = Number.parseFloat(eczane.LokasyonY);

    if (!isValidCoordinate(latitude, longitude)) {
        return null;
    }

    const phoneAction = createPhoneAction(eczane.Telefon);

    return createMapPoint({
        id: buildMapPointId('eczane', eczane.Adi, latitude, longitude),
        title: eczane.Adi,
        subtitle: eczane.Adres,
        description: eczane.BolgeAciklama,
        latitude,
        longitude,
        badge: eczane.Bolge,
        detailLines: [
            `Telefon: ${eczane.Telefon || 'Bilinmiyor'}`,
            `Tarih: ${formatDate(eczane.Tarih)}`,
        ],
        actions: compactActions([phoneAction, createRouteAction(latitude, longitude)]),
    });
};

const mapOtopark = (otopark: OtoparkBilgisi): MapPoint | null => {
    if (!isValidCoordinate(otopark.lat, otopark.lng)) {
        return null;
    }

    const totalCapacity = otopark.occupancy.total.free + otopark.occupancy.total.occupied;

    return createMapPoint({
        id: buildMapPointId('otopark', otopark.ufid, otopark.lng, otopark.lat),
        title: otopark.name,
        subtitle: `${otopark.provider} • ${otopark.type}`,
        description: otopark.nonstop ? '24 saat açık' : 'Çalışma saati bilgisi mevcut',
        latitude: otopark.lat,
        longitude: otopark.lng,
        badge: otopark.status === 'Opened' ? 'Açık' : 'Kapalı',
        detailLines: [
            `Boş: ${otopark.occupancy.total.free}`,
            `Dolu: ${otopark.occupancy.total.occupied}`,
            `Toplam kapasite: ${totalCapacity}`,
            `Ücretli: ${otopark.isPaid ? 'Evet' : 'Hayır'}`,
        ],
        actions: [createRouteAction(otopark.lat, otopark.lng)],
    });
};

const mapOnemliYer = (prefix: string, point: DefaultOnemliYer): MapPoint | null => {
    if (!isValidCoordinate(point.ENLEM, point.BOYLAM)) {
        return null;
    }

    return createMapPoint({
        id: buildMapPointId(prefix, point.ADI, point.ENLEM, point.BOYLAM),
        title: point.ADI,
        subtitle: `${point.ILCE} / ${point.MAHALLE}`,
        description: point.ACIKLAMA,
        latitude: point.ENLEM,
        longitude: point.BOYLAM,
        badge: point.ILCE,
        detailLines: [
            `Yol: ${point.YOL || 'Bilinmiyor'}`,
            `Kapı No: ${point.KAPINO || 'Bilinmiyor'}`,
        ],
        actions: [createRouteAction(point.ENLEM, point.BOYLAM)],
    });
};

const mapOnemliYerCollection = (prefix: string, points: DefaultOnemliYer[]) => {
    return compactPoints(points.map((point) => mapOnemliYer(prefix, point)));
};

const loadWrappedPoints = async (
    prefix: string,
    loader: () => Promise<{ onemliyer: DefaultOnemliYer[] }>,
) => {
    const response = await loader();
    return mapOnemliYerCollection(prefix, response.onemliyer);
};

const compactPoints = (points: Array<MapPoint | null>) => {
    return points.filter((point): point is MapPoint => point !== null);
};

const compactActions = (actions: Array<MapPointAction | null>) => {
    return actions.filter((action): action is MapPointAction => action !== null);
};

export const loadDutyPharmacies = async () => {
    const pharmacies = await izmirOpenDataClient.eczaneler.getNobetciList();
    return compactPoints(pharmacies.map(mapEczane));
};

export const loadAllPharmacies = async () => {
    const pharmacies = await izmirOpenDataClient.eczaneler.getList();
    return compactPoints(pharmacies.map(mapEczane));
};

export const loadParkingPoints = async () => {
    const parkingList = await izmirOpenDataClient.otopark.getList();
    return compactPoints(parkingList.map(mapOtopark));
};

export const loadWifiPoints = async () => {
    return loadWrappedPoints('wizmirnet', () => izmirOpenDataClient.wizmirnet.getList());
};

export const loadEmergencyAssemblyPoints = async () => {
    return loadWrappedPoints('afet-toplanma', () => izmirOpenDataClient.afetler.getAcilDurumToplanmaAlanlari());
};

export const loadMarketPlaces = async () => {
    return loadWrappedPoints('pazar', () => izmirOpenDataClient.pazarlar.getList());
};

export const loadMunicipalServicePoints = async () => {
    return loadWrappedPoints('hizmet', () => izmirOpenDataClient.hizmet.getHizmetNoktaList());
};

export const loadHospitals = async () => {
    return loadWrappedPoints('hastane', () => izmirOpenDataClient.saglik.getHastanelerList());
};

export const loadFamilyHealthCenters = async () => {
    return loadWrappedPoints('asm', () => izmirOpenDataClient.saglik.getAileSagligiMerkezleriList());
};

export const loadVeterinaryClinics = async () => {
    return loadWrappedPoints('veteriner', () => izmirOpenDataClient.saglik.getVeterinerliklerList());
};

export const loadUniversities = async () => {
    return loadWrappedPoints('universite', () => izmirOpenDataClient.egitim.getUniversitelerList());
};

export const loadHighSchools = async () => {
    return loadWrappedPoints('lise', () => izmirOpenDataClient.egitim.getLiselerList());
};

export const loadKindergartens = async () => {
    return loadWrappedPoints('anaokulu', () => izmirOpenDataClient.egitim.getAnaokullarList());
};

export const loadTaxiStands = async () => {
    return loadWrappedPoints('taksi', () => izmirOpenDataClient.taksi.getDurakList());
};

