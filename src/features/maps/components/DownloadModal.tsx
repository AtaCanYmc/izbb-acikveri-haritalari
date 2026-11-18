import {useEffect} from 'react';
import {X, Image, FileJson, FileText, MapPin, FileCode} from 'lucide-react';
import {toast} from 'react-hot-toast';
import clsx from 'clsx';
import type {MapPoint} from '../types/mapData.ts';

interface DownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    mapTitle: string;
    mapPoints: MapPoint[];
    isDarkMode: boolean;
    onDownloadPNG: () => Promise<void>;
}

export const DownloadModal = ({
    isOpen,
    onClose,
    mapTitle,
    mapPoints,
    isDarkMode,
    onDownloadPNG,
}: DownloadModalProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleDownloadJSON = () => {
        try {
            const data = {
                title: mapTitle,
                timestamp: new Date().toISOString(),
                pointCount: mapPoints.length,
                points: mapPoints,
            };

            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${mapTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);

            toast.success('JSON dosyası indirildi');
            onClose();
        } catch (error) {
            console.error('JSON indirme hatası:', error);
            toast.error('JSON indirme hatası oluştu');
        }
    };

    const handleDownloadCSV = () => {
        try {
            if (mapPoints.length === 0) {
                toast.error('İndirilecek veri bulunamadı');
                return;
            }

            const headers = ['ID', 'Başlık', 'Açıklama', 'Enlem', 'Boylam', 'Badge'];
            const rows = mapPoints.map((point) => [
                point.id || '',
                `"${(point.title || '').replace(/"/g, '""')}"`,
                `"${(point.subtitle || '').replace(/"/g, '""')}"`,
                point.latitude || '',
                point.longitude || '',
                point.badge || '',
            ]);

            const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
            const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${mapTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            URL.revokeObjectURL(url);

            toast.success('CSV tablosu indirildi');
            onClose();
        } catch (error) {
            console.error('CSV indirme hatası:', error);
            toast.error('CSV indirme hatası oluştu');
        }
    };

    const handleDownloadGeoJSON = () => {
        try {
            if (mapPoints.length === 0) {
                toast.error('İndirilecek veri bulunamadı');
                return;
            }

            const features = mapPoints.map((point: MapPoint) => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [point.longitude || 0, point.latitude || 0],
                },
                properties: {
                    id: point.id,
                    title: point.title,
                    subtitle: point.subtitle,
                    description: point.description,
                    badge: point.badge,
                },
            }));

            const geoJson = {
                type: 'FeatureCollection',
                features,
            };

            const json = JSON.stringify(geoJson, null, 2);
            const blob = new Blob([json], {type: 'application/geo+json'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${mapTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.geojson`;
            link.click();
            URL.revokeObjectURL(url);

            toast.success('GeoJSON verisi indirildi');
            onClose();
        } catch (error) {
            console.error('GeoJSON indirme hatası:', error);
            toast.error('GeoJSON indirme hatası oluştu');
        }
    };

    const handleDownloadHTML = () => {
        try {
            if (mapPoints.length === 0) {
                toast.error('İndirilecek veri bulunamadı');
                return;
            }

            const cdnLeafletCss = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
            const cdnClusterCss = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.min.css';
            const cdnClusterDefaultCss = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.min.css';
            const cdnLeafletJs = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
            const cdnClusterJs = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.min.js';

            const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${mapTitle} - İzmir Açık Veri Haritası</title>
    <link rel="stylesheet" href="${cdnLeafletCss}" />
    <link rel="stylesheet" href="${cdnClusterCss}" />
    <link rel="stylesheet" href="${cdnClusterDefaultCss}" />
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        #map { width: 100vw; height: 100vh; }
        .info { padding: 8px 12px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 1px solid #e2e8f0; }
        .info h4 { margin: 0 0 4px 0; color: #0284c7; font-size: 14px; font-weight: 700; }
        .info p { margin: 2px 0; font-size: 12px; color: #475569; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="${cdnLeafletJs}"></script>
    <script src="${cdnClusterJs}"></script>
    <script>
        const map = L.map('map').setView([38.4237, 27.1428], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        const markerClusterGroup = L.markerClusterGroup();
        const points = ${JSON.stringify(mapPoints)};

        points.forEach(point => {
            if (point.latitude && point.longitude) {
                const marker = L.marker([point.latitude, point.longitude]);
                const popupContent = \`
                    <div style="min-width: 180px;">
                        <h4 style="margin: 0 0 6px 0; color: #0284c7; font-size: 13px; font-weight: 700;">\${point.title || ''}</h4>
                        \${point.subtitle ? \`<p style="margin: 3px 0; font-size: 11px; color: #475569;">\${point.subtitle}</p>\` : ''}
                        \${point.description ? \`<p style="margin: 3px 0; font-size: 11px; color: #64748b;">\${point.description}</p>\` : ''}
                        \${point.badge ? \`<span style="display:inline-block; margin-top:4px; font-size:10px; background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px; font-weight:600;">\${point.badge}</span>\` : ''}
                    </div>
                \`;
                marker.bindPopup(popupContent);
                markerClusterGroup.addLayer(marker);
            }
        });

        map.addLayer(markerClusterGroup);

        const info = L.control({position: 'topright'});
        info.onAdd = () => {
            const div = L.DomUtil.create('div', 'info');
            div.innerHTML = \`
                <h4>${mapTitle}</h4>
                <p><strong>\${points.length}</strong> konum kayıtlı</p>
            \`;
            return div;
        };
        info.addTo(map);
    </script>
</body>
</html>`;

            const blob = new Blob([html], {type: 'text/html;charset=utf-8;'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${mapTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.html`;
            link.click();
            URL.revokeObjectURL(url);

            toast.success('Çevrimdışı HTML harita indirildi');
            onClose();
        } catch (error) {
            console.error('HTML indirme hatası:', error);
            toast.error('HTML indirme hatası oluştu');
        }
    };

    const handleDownloadPNG = async () => {
        await onDownloadPNG();
        onClose();
    };

    const downloadOptions = [
        {
            id: 'png',
            label: 'Harita Görüntüsü (PNG)',
            description: 'Mevcut harita görünümünü görsel olarak kaydeder',
            icon: Image,
            onClick: handleDownloadPNG,
        },
        {
            id: 'geojson',
            label: 'GIS Katmanı (GeoJSON)',
            description: 'QGIS, ArcGIS ve web haritaları için standart format',
            icon: MapPin,
            onClick: handleDownloadGeoJSON,
        },
        {
            id: 'csv',
            label: 'Tablo Verisi (CSV)',
            description: 'Excel ve veri analizi araçları için koordinat tablosu',
            icon: FileText,
            onClick: handleDownloadCSV,
        },
        {
            id: 'json',
            label: 'Ham Veri (JSON)',
            description: 'Tüm öznitelikleri içeren yapılandırılmış veri kümesi',
            icon: FileJson,
            onClick: handleDownloadJSON,
        },
        {
            id: 'html',
            label: 'Bağımsız Harita (HTML)',
            description: 'İnternet tarayıcısında tek başına çalışan çevrimdışı harita',
            icon: FileCode,
            onClick: handleDownloadHTML,
        },
    ];

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-modal-title"
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog Content */}
            <div className={clsx(
                'relative w-full max-w-lg rounded-2xl p-6 shadow-2xl border transition-all duration-200 z-10 max-h-[90vh] overflow-y-auto overscroll-contain custom-scrollbar',
                isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            )}>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 id="download-modal-title" className="text-lg font-bold tracking-tight">
                            Veri Dışa Aktarımı
                        </h2>
                        <p className={clsx('text-xs mt-0.5', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                            {mapTitle} ({mapPoints.length} konum)
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Kapat"
                        className={clsx(
                            'p-2 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center',
                            isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        )}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Options List */}
                <div className="space-y-2">
                    {downloadOptions.map((opt) => {
                        const Icon = opt.icon;
                        return (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={opt.onClick}
                                className={clsx(
                                    'w-full p-3.5 rounded-xl border text-left transition-colors flex items-center gap-3.5 group min-h-[52px]',
                                    isDarkMode
                                        ? 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-sky-500/50'
                                        : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-sky-500 hover:shadow-xs'
                                )}
                            >
                                <div className={clsx(
                                    'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                                    isDarkMode ? 'bg-slate-900 text-sky-400 group-hover:bg-sky-950' : 'bg-white text-sky-600 group-hover:bg-sky-50 shadow-xs'
                                )}>
                                    <Icon size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-xs tracking-tight">
                                        {opt.label}
                                    </h3>
                                    <p className={clsx(
                                        'text-[11px] truncate',
                                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                    )}>
                                        {opt.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Cancel Button */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className={clsx(
                            'px-4 py-2 rounded-lg text-xs font-semibold transition-colors min-h-[44px]',
                            isDarkMode
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        )}
                    >
                        Vazgeç
                    </button>
                </div>
            </div>
        </div>
    );
};
