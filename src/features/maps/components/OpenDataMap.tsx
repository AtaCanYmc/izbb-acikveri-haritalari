import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import {getMapIcon, userIcon} from '../../../components/map/mapIcons.tsx';
import type {MapPoint} from '../types/mapData.ts';
import {getTileLayerConfig} from '../utils/mapTileConfig.ts';
import {
    clusterPointsInGrid,
    filterPointsByBounds,
    WORKER_CLUSTER_THRESHOLD,
    type ClusterBucket,
    type GeoBounds,
} from '../utils/viewportBounds.ts';
import type {ClusterWorkerRequest, ClusterWorkerResponse} from '../workers/clusterWorker.ts';
import {escapeHtml, sanitizeUrl} from '../../../utils/security.ts';

// Default icon is no longer globally set to avoid overriding custom icons
// L.Marker.prototype.options.icon = DefaultIcon;

const IZMIR_CENTER: [number, number] = [38.4237, 27.1428];

interface OpenDataMapProps {
    points: MapPoint[];
    selectedPoint: MapPoint | null;
    onMarkerClick: (point: MapPoint) => void;
    onUserLocationChange?: (location: [number, number]) => void;
    isDarkMode?: boolean;
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
        const timerId = window.setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => window.clearTimeout(timerId);
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

        let isActive = true;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (isActive) {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                }
            },
            () => {
                // Geolocation error is handled by useLocationPermission
            },
        );

        return () => {
            isActive = false;
        };
    }, []);

    return userLocation;
};

type LeafletWithCluster = typeof L & {
    markerClusterGroup?: (options?: Record<string, unknown>) => L.FeatureGroup;
};

const buildPopupHtml = (point: MapPoint) => {
    const safeTitle = escapeHtml(point.title);
    const safeSubtitle = point.subtitle ? `<p class="text-[11px] mb-2 leading-tight opacity-85">${escapeHtml(point.subtitle)}</p>` : '';
    const safeDescription = point.description ? `<p class="text-[10px] mb-2 opacity-75">${escapeHtml(point.description)}</p>` : '';
    const safeBadge = point.badge ? `<div class="flex justify-end"><span class="font-bold text-[9px] uppercase text-izmir-700">${escapeHtml(point.badge)}</span></div>` : '';
    const safeDetailLines = point.detailLines.map((line) => `<div class="text-[10px] opacity-75">${escapeHtml(line)}</div>`).join('');
    const safeActions = point.actions && point.actions.length > 0 ? `
        <div class="flex flex-col gap-2 pb-2">
            ${point.actions.map((action) => {
                const safeHref = escapeHtml(sanitizeUrl(action.href));
                const safeLabel = escapeHtml(action.label);
                const targetAttr = action.external ? 'target="_blank"' : '';
                const relAttr = action.external ? 'rel="noopener noreferrer"' : '';
                return `
                    <a href="${safeHref}" ${targetAttr} ${relAttr} class="flex-1 bg-slate-900 text-white text-center py-2 rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors">
                        ${safeLabel}
                    </a>
                `;
            }).join('')}
        </div>
    ` : '';

    return `
        <div class="p-1 min-w-[170px] text-inherit">
            <h3 class="font-bold border-b pb-1 mb-1">${safeTitle}</h3>
            ${safeSubtitle}
            ${safeDescription}
            <div class="flex flex-col gap-1.5">
                ${safeActions}
                ${safeDetailLines}
                ${safeBadge}
            </div>
        </div>
    `;
};

const createWorkerClusterIcon = (count: number) => {
    const size = count >= 100 ? 44 : count >= 20 ? 38 : 32;
    return L.divIcon({
        className: 'worker-cluster-marker',
        html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:#0284c7;color:#ffffff;border:3px solid rgba(56,189,248,0.6);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;box-shadow:0 6px 16px rgba(2,132,199,0.45);">${count}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
};

const readMapViewport = (map: L.Map): { bounds: GeoBounds; zoom: number } => {
    const b = map.getBounds();
    return {
        bounds: {
            north: b.getNorth(),
            south: b.getSouth(),
            east: b.getEast(),
            west: b.getWest(),
        },
        zoom: map.getZoom(),
    };
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
    const useWorkerMode = points.length > WORKER_CLUSTER_THRESHOLD;

    const [viewport, setViewport] = useState<{ bounds: GeoBounds; zoom: number }>(() => readMapViewport(map));
    const [workerClusters, setWorkerClusters] = useState<ClusterBucket[]>([]);
    const workerRef = useRef<Worker | null>(null);
    const workerRequestIdRef = useRef(0);

    const [clusterGroup] = useState<L.FeatureGroup>(() => {
        const leaflet = L as LeafletWithCluster;
        if (leaflet.markerClusterGroup) {
            return leaflet.markerClusterGroup({
                maxClusterRadius: 80,
                disableClusteringAtZoom: 15,
            });
        }
        return L.featureGroup();
    });
    const [workerLayer] = useState<L.LayerGroup>(() => L.layerGroup());
    const markersByIdRef = useRef<Map<string, { marker: L.Marker; type: string }>>(new Map());
    const previousSelectedIdRef = useRef<string | null>(null);

    const syncViewport = useCallback(() => {
        setViewport(readMapViewport(map));
    }, [map]);

    useEffect(() => {
        map.on('moveend zoomend', syncViewport);
        return () => {
            map.off('moveend zoomend', syncViewport);
        };
    }, [map, syncViewport]);

    useEffect(() => {
        const activeLayer = useWorkerMode ? workerLayer : clusterGroup;
        map.addLayer(activeLayer);

        return () => {
            map.removeLayer(activeLayer);
        };
    }, [map, clusterGroup, workerLayer, useWorkerMode]);

    // Manage WebWorker lifecycle for heavy datasets (> 2,000 points)
    useEffect(() => {
        if (!useWorkerMode) {
            return;
        }

        if (typeof Worker === 'undefined') {
            return;
        }

        const worker = new Worker(new URL('../workers/clusterWorker.ts', import.meta.url), {
            type: 'module',
        });
        workerRef.current = worker;

        worker.onmessage = (event: MessageEvent<ClusterWorkerResponse>) => {
            if (event.data.requestId === workerRequestIdRef.current) {
                setWorkerClusters(event.data.clusters);
            }
        };

        return () => {
            worker.terminate();
            workerRef.current = null;
        };
    }, [useWorkerMode]);

    const hasWorkerSupport = typeof Worker !== 'undefined';

    useEffect(() => {
        if (!useWorkerMode || !hasWorkerSupport || !workerRef.current) {
            return;
        }

        const requestId = ++workerRequestIdRef.current;
        const payload: ClusterWorkerRequest = {
            requestId,
            points,
            bounds: viewport.bounds,
            zoom: viewport.zoom,
        };
        workerRef.current.postMessage(payload);
    }, [useWorkerMode, hasWorkerSupport, points, viewport]);

    const activeWorkerClusters = useMemo(() => {
        if (!useWorkerMode) {
            return [];
        }
        if (hasWorkerSupport) {
            return workerClusters;
        }
        const visible = filterPointsByBounds(points, viewport.bounds);
        return clusterPointsInGrid(visible, viewport.zoom);
    }, [useWorkerMode, hasWorkerSupport, workerClusters, points, viewport]);

    // Viewport-bounded points for standard mode (<= 2,000 points)
    const visiblePoints = useMemo(() => {
        if (useWorkerMode) {
            return [];
        }
        const bounded = filterPointsByBounds(points, viewport.bounds);
        if (selectedPoint && !bounded.some((p) => p.id === selectedPoint.id)) {
            return [...bounded, selectedPoint];
        }
        return bounded;
    }, [useWorkerMode, points, viewport.bounds, selectedPoint]);

    // Render standard Leaflet MarkerCluster markers (viewport-bounded)
    useEffect(() => {
        if (useWorkerMode) {
            return;
        }

        clusterGroup.clearLayers();
        const markersMap = new Map<string, { marker: L.Marker; type: string }>();

        visiblePoints.forEach((point) => {
            const isSelected = selectedPoint?.id === point.id;
            const icon = getMapIcon(point.type, isSelected);
            const marker = L.marker([point.latitude, point.longitude], {icon});

            marker.bindPopup(L.popup().setContent(buildPopupHtml(point)));

            marker.on('click', () => {
                marker.openPopup();
                onMarkerClick(point);
            });

            markersMap.set(point.id, {marker, type: point.type});
            clusterGroup.addLayer(marker);
        });

        markersByIdRef.current = markersMap;
        previousSelectedIdRef.current = selectedPoint?.id ?? null;
    }, [useWorkerMode, visiblePoints, clusterGroup, onMarkerClick, selectedPoint]);

    // Render WebWorker-computed clusters for > 2,000 coordinates
    useEffect(() => {
        if (!useWorkerMode) {
            return;
        }

        workerLayer.clearLayers();
        const markersMap = new Map<string, { marker: L.Marker; type: string }>();

        activeWorkerClusters.forEach((bucket) => {
            if (bucket.count > 1) {
                const clusterMarker = L.marker([bucket.latitude, bucket.longitude], {
                    icon: createWorkerClusterIcon(bucket.count),
                });
                clusterMarker.on('click', () => {
                    map.flyTo([bucket.latitude, bucket.longitude], Math.min(16, map.getZoom() + 2), {
                        animate: true,
                        duration: 0.6,
                    });
                });
                workerLayer.addLayer(clusterMarker);
                return;
            }

            const point = bucket.samplePoint;
            const isSelected = selectedPoint?.id === point.id;
            const marker = L.marker([point.latitude, point.longitude], {
                icon: getMapIcon(point.type, isSelected),
            });
            marker.bindPopup(L.popup().setContent(buildPopupHtml(point)));
            marker.on('click', () => {
                marker.openPopup();
                onMarkerClick(point);
            });
            markersMap.set(point.id, {marker, type: point.type});
            workerLayer.addLayer(marker);
        });

        markersByIdRef.current = markersMap;
        previousSelectedIdRef.current = selectedPoint?.id ?? null;
    }, [useWorkerMode, activeWorkerClusters, workerLayer, map, onMarkerClick, selectedPoint]);

    useEffect(() => {
        const markersMap = markersByIdRef.current;
        const prevId = previousSelectedIdRef.current;
        const nextId = selectedPoint?.id ?? null;

        if (prevId && prevId !== nextId) {
            const prevEntry = markersMap.get(prevId);
            if (prevEntry) {
                prevEntry.marker.setIcon(getMapIcon(prevEntry.type, false));
            }
        }

        if (nextId) {
            const nextEntry = markersMap.get(nextId);
            if (nextEntry) {
                nextEntry.marker.setIcon(getMapIcon(nextEntry.type, true));
            }
        }

        previousSelectedIdRef.current = nextId;
    }, [selectedPoint]);

    return null;
};

export const OpenDataMap = ({points, selectedPoint, onMarkerClick, onUserLocationChange, isDarkMode = false}: OpenDataMapProps) => {
    const userLocation = useUserLocation();

    useEffect(() => {
        if (userLocation && onUserLocationChange) {
            onUserLocationChange(userLocation);
        }
    }, [userLocation, onUserLocationChange]);

    const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;
    const tileConfig = getTileLayerConfig(cartoApiKey, isDarkMode);

    return (
        <div className="h-full w-full relative z-0 min-h-[100vh]">
            <MapContainer center={IZMIR_CENTER} zoom={11} style={{height: '100%', width: '100%'}} zoomControl={false}>
                <TileLayer
                    url={tileConfig.url}
                    attribution={tileConfig.attribution}
                    maxZoom={tileConfig.maxZoom}
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

