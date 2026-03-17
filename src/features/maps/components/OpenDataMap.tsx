import {useEffect, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import {DefaultIcon, SelectedIcon, userIcon} from '../../../components/map/mapIcons.tsx';
import type {MapPoint} from '../types/mapData.ts';

L.Marker.prototype.options.icon = DefaultIcon;

const IZMIR_CENTER: [number, number] = [38.4237, 27.1428];

interface OpenDataMapProps {
    points: MapPoint[];
    selectedPoint: MapPoint | null;
    onMarkerClick: (point: MapPoint) => void;
}

const ChangeView = ({center}: { center: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
        map.setView(center, 13);
    }, [center, map]);

    return null;
};

const MapResizer = ({selectedPoint}: { selectedPoint: MapPoint | null }) => {
    const map = useMap();

    useEffect(() => {
        window.setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [map]);

    useEffect(() => {
        if (!selectedPoint) {
            return;
        }

        map.flyTo([selectedPoint.latitude, selectedPoint.longitude], 15, {
            animate: true,
            duration: 1.5,
        });
    }, [map, selectedPoint]);

    return null;
};

const LocationButton = ({userLocation}: { userLocation: [number, number] | null }) => {
    const map = useMap();

    const handleClick = () => {
        if (!userLocation) {
            window.alert('Konumunuz henüz alınamadı. Lütfen izin verdiğinizden emin olun.');
            return;
        }

        map.flyTo(userLocation, 15, {duration: 1.5});
    };

    return (
        <div className="leaflet-bottom leaflet-right !mb-24 !ml-3">
            <div className="leaflet-control">
                <button
                    onClick={handleClick}
                    className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-90"
                    title="Konumuma Dön"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-6 h-6 ${userLocation ? 'text-blue-600' : 'text-slate-400'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        <circle cx="12" cy="12" r="3" fill="currentColor" className="opacity-20"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 2v2m0 16v2m10-10h-2M4 10H2"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};


const UserLocationMarker = ({userLocation}: { userLocation: [number, number] | null }) => {
    if (!userLocation) {
        return null;
    }

    return (
        <Marker position={userLocation} icon={userIcon}>
            <Popup>Buradasınız</Popup>
        </Marker>
    );
};

const useUserLocation = () => {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation([position.coords.latitude, position.coords.longitude]);
        });
    }, []);

    return userLocation;
};

const ClusteredMarkers = ({
    points,
    selectedPoint,
    onMarkerClick,
}: {
    points: MapPoint[];
    selectedPoint: MapPoint | null;
    onMarkerClick: (point: MapPoint) => void;
}) => {
    const map = useMap();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [clusterGroup] = useState(() => ((L as any).markerClusterGroup || L.featureGroup)({
        maxClusterRadius: 80,
        disableClusteringAtZoom: 15,
    }));

    useEffect(() => {
        // Cluster group'u haritaya ekle
        map.addLayer(clusterGroup);

        return () => {
            map.removeLayer(clusterGroup);
        };
    }, [map, clusterGroup]);

    useEffect(() => {
        // Cluster group'u temizle ve yeni marker'ları ekle
        clusterGroup.clearLayers();

        points.forEach((point) => {
            const isSelected = selectedPoint?.id === point.id;
            const icon = isSelected ? SelectedIcon : DefaultIcon;

            const marker = L.marker([point.latitude, point.longitude], {icon});

            marker.bindPopup(
                L.popup().setContent(`
                    <div class="p-1 min-w-[170px] text-inherit">
                        <h3 class="font-bold border-b pb-1 mb-1">${point.title}</h3>
                        ${point.subtitle ? `<p class="text-[11px] mb-2 leading-tight opacity-85">${point.subtitle}</p>` : ''}
                        ${point.description ? `<p class="text-[10px] mb-2 opacity-75">${point.description}</p>` : ''}
                        <div class="flex flex-col gap-1.5">
                            ${point.actions && point.actions.length > 0 ? `
                                <div class="flex flex-col gap-2 pb-2">
                                    ${point.actions.map((action) => `
                                        <a href="${action.href}" target="${action.external ? '_blank' : ''}" class="flex-1 bg-slate-900 text-white text-center py-2 rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors">
                                            ${action.label}
                                        </a>
                                    `).join('')}
                                </div>
                            ` : ''}
                            ${point.detailLines.map((line) => `<div class="text-[10px] opacity-75">${line}</div>`).join('')}
                            ${point.badge ? `<div class="flex justify-end"><span class="font-bold text-[9px] uppercase text-red-700">${point.badge}</span></div>` : ''}
                        </div>
                    </div>
                `)
            );

            marker.on('click', () => {
                onMarkerClick(point);
            });

            clusterGroup.addLayer(marker);
        });
    }, [points, selectedPoint, clusterGroup, onMarkerClick]);

    return null;
};

export const OpenDataMap = ({points, selectedPoint, onMarkerClick}: OpenDataMapProps) => {
    const userLocation = useUserLocation();

    return (
        <div className="h-full w-full relative z-0 min-h-[100vh]">
            <MapContainer center={IZMIR_CENTER} zoom={11} style={{height: '100%', width: '100%'}} zoomControl={false}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution="&copy; OpenStreetMap"
                />
                <MapResizer selectedPoint={selectedPoint}/>
                {userLocation && <ChangeView center={userLocation}/>}
                <ZoomControl position="bottomright"/>
                <LocationButton userLocation={userLocation}/>
                <ClusteredMarkers points={points} selectedPoint={selectedPoint} onMarkerClick={onMarkerClick}/>
                <UserLocationMarker userLocation={userLocation}/>
            </MapContainer>
        </div>
    );
};

