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

            toast.success('JSON başarıyla indirildi!');
            onClose();
        } catch (error) {
            console.error('JSON indirme hatası:', error);
            toast.error('JSON indirme hatası.');
        }
    };

    const handleDownloadCSV = () => {
        try {
            if (mapPoints.length === 0) {
                toast.error('İndirilecek veri yok');
                return;
            }

            // CSV başlık satırı
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

            toast.success('CSV başarıyla indirildi!');
            onClose();
        } catch (error) {
            console.error('CSV indirme hatası:', error);
            toast.error('CSV indirme hatası.');
        }
    };

    const handleDownloadGeoJSON = () => {
        try {
            if (mapPoints.length === 0) {
                toast.error('İndirilecek veri yok');
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

            toast.success('GeoJSON başarıyla indirildi!');
            onClose();
        } catch (error) {
            console.error('GeoJSON indirme hatası:', error);
            toast.error('GeoJSON indirme hatası.');
        }
    };

    const handleDownloadHTML = () => {
        try {
            if (mapPoints.length === 0) {
                toast.error('İndirilecek veri yok');
                return;
            }

            // Leaflet harita HTML'i oluştur
            const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${mapTitle} - İzmir Açık Veri Haritası</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.min.css" />
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }
        #map { width: 100vw; height: 100vh; }
        .info { padding: 6px 8px; background: white; border-radius: 8px; box-shadow: 0 0 15px rgba(0,0,0,0.2); }
        .info h4 { margin: 0 0 5px 0; color: #dc2626; font-weight: 600; }
        .info p { margin: 3px 0; font-size: 13px; color: #666; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.min.js"></script>
    <script>
        // Harita oluştur
        const map = L.map('map').setView([38.4237, 27.1428], 11);
        
        // Tile layer ekle
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        // Marker cluster grubu oluştur
        const markerClusterGroup = L.markerClusterGroup();

        // Veri noktaları
        const points = ${JSON.stringify(mapPoints)};

        // Marker'ları ekle
        points.forEach(point => {
            if (point.latitude && point.longitude) {
                const marker = L.marker([point.latitude, point.longitude]);
                
                const popupContent = \`
                    <div style="min-width: 200px;">
                        <h4 style="margin: 0 0 8px 0; color: #dc2626; font-weight: 600;">\${point.title || 'İsim Yok'}</h4>
                        <p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Açıklama:</strong> \${point.subtitle || '-'}</p>
                        \${point.description ? \`<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Detay:</strong> \${point.description}</strong></p>\` : ''}
                        \${point.badge ? \`<p style="margin: 4px 0; font-size: 12px;"><span style="background: #fee2e2; color: #dc2626; padding: 2px 6px; border-radius: 4px;">\${point.badge}</span></p>\` : ''}
                    </div>
                \`;
                
                marker.bindPopup(popupContent);
                markerClusterGroup.addLayer(marker);
            }
        });

        map.addLayer(markerClusterGroup);

        // Info paneli ekle
        const info = L.control();
        info.onAdd = () => {
            const div = L.DomUtil.create('div', 'info');
            div.innerHTML = \`
                <h4>${mapTitle}</h4>
                <p><strong>\${points.length}</strong> konum</p>
                <p style="font-size: 11px; margin-top: 8px; color: #999;">İzmir Açık Veri Haritası</p>
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

            toast.success('HTML harita başarıyla indirildi!');
            onClose();
        } catch (error) {
            console.error('HTML indirme hatası:', error);
            toast.error('HTML indirme hatası.');
        }
    };

    const handleDownloadPNG = async () => {
        await onDownloadPNG();
        onClose();
    };

    const downloadOptions = [
        {
            id: 'png',
            label: 'Harita (PNG)',
            description: 'Haritanın görüntüsünü indir',
            icon: Image,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-950',
            onClick: handleDownloadPNG,
        },
        {
            id: 'json',
            label: 'Veri (JSON)',
            description: 'Tüm verileri JSON formatında indir',
            icon: FileJson,
            color: 'text-yellow-600 dark:text-yellow-400',
            bgColor: 'bg-yellow-50 dark:bg-yellow-950',
            onClick: handleDownloadJSON,
        },
        {
            id: 'csv',
            label: 'Tablo (CSV)',
            description: 'Verileri tablo formatında indir',
            icon: FileText,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-950',
            onClick: handleDownloadCSV,
        },
        {
            id: 'geojson',
            label: 'Harita Verisi (GeoJSON)',
            description: 'Verileri GIS formatında indir',
            icon: MapPin,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-950',
            onClick: handleDownloadGeoJSON,
        },
        {
            id: 'html',
            label: 'İnteraktif Harita (HTML)',
            description: 'Tarayıcıda açılabilen harita indir',
            icon: FileCode,
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-50 dark:bg-orange-950',
            onClick: handleDownloadHTML,
        },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[2001] flex items-center justify-center p-4">
                <div className={`
                    bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md
                    border border-slate-200 dark:border-slate-700
                    animate-in fade-in zoom-in-95 duration-200
                `}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            İndirme Formatı Seç
                        </h2>
                        <button
                            onClick={onClose}
                            className="h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
                        >
                            <X size={24} className="text-slate-400 dark:text-slate-500" />
                        </button>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Harita ve verilerinizi istediğiniz formatta indirebilirsiniz.
                    </p>

                    {/* Download Options */}
                    <div className="space-y-3">
                        {downloadOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <button
                                    key={option.id}
                                    onClick={option.onClick}
                                    className={clsx(
                                        'w-full p-4 rounded-xl border-2 border-transparent transition-all group',
                                        isDarkMode
                                            ? 'hover:border-slate-600'
                                            : 'hover:border-slate-300'
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={clsx(
                                            'p-2 rounded-lg group-hover:scale-110 transition-transform',
                                            isDarkMode ? option.bgColor.replace('50', '950') : option.bgColor
                                        )}>
                                            <Icon size={24} className={option.color} />
                                        </div>
                                        <div className="text-left flex-1">
                                            <h3 className={clsx('font-semibold', option.color)}>
                                                {option.label}
                                            </h3>
                                            <p className={clsx(
                                                'text-xs mt-1',
                                                isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                            )}>
                                                {option.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className={clsx(
                        'mt-6 pt-6 border-t',
                        isDarkMode ? 'border-slate-700' : 'border-slate-200'
                    )}>
                        <button
                            onClick={onClose}
                            className={clsx(
                                'w-full py-2 px-4 rounded-lg font-medium transition-colors',
                                isDarkMode
                                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            )}
                        >
                            İptal Et
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

