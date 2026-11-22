import {useEffect} from 'react';
import {X, Phone, Navigation, MapPin} from 'lucide-react';
import clsx from 'clsx';
import type {MapPoint} from '../types/mapData.ts';
import {sanitizeUrl} from '../../../utils/security.ts';

interface SelectedPointCardProps {
    point: MapPoint | null;
    onClose: () => void;
    isDarkMode?: boolean;
}

export const SelectedPointCard = ({point, onClose, isDarkMode = false}: SelectedPointCardProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && point) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [point, onClose]);

    if (!point) {
        return null;
    }

    return (
        <aside
            aria-label="Seçili konum detayları"
            className={clsx(
                // Mobile: Slide-up bottom sheet
                'fixed inset-x-0 bottom-0 z-[1005] p-4 rounded-t-2xl shadow-2xl border-t transition-transform duration-200 max-h-[85vh] overflow-y-auto overscroll-contain',
                // Desktop: Floating card in bottom-right corner
                'md:fixed md:inset-auto md:bottom-6 md:right-6 md:w-96 md:rounded-2xl md:border md:shadow-xl md:max-h-[80vh]',
                isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-slate-100'
                    : 'bg-white border-slate-200 text-slate-900'
            )}
        >
            {/* Mobile Sheet Drag Pill Indicator */}
            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3 md:hidden" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {point.badge && (
                            <span className={clsx(
                                'text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded',
                                isDarkMode ? 'bg-sky-950 text-sky-400 border border-sky-800' : 'bg-sky-50 text-sky-700 border border-sky-200'
                            )}>
                                {point.badge}
                            </span>
                        )}
                        {point.latitude && point.longitude && (
                            <span className="text-[10px] font-mono text-slate-400">
                                {Number(point.latitude).toFixed(4)}, {Number(point.longitude).toFixed(4)}
                            </span>
                        )}
                    </div>
                    <h2 className="font-bold text-base sm:text-lg tracking-tight leading-snug break-words">
                        {point.title}
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Kapat"
                    className={clsx(
                        'p-2 rounded-lg transition-colors shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center',
                        isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    )}
                >
                    <X size={18} />
                </button>
            </div>

            {/* Subtitle / Address */}
            {point.subtitle && (
                <div className="flex items-start gap-2 mb-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <MapPin size={15} className="text-sky-600 shrink-0 mt-0.5" />
                    <span>{point.subtitle}</span>
                </div>
            )}

            {/* Description */}
            {point.description && (
                <p className="text-xs mb-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                    {point.description}
                </p>
            )}

            {/* Detailed metadata lines */}
            {point.detailLines && point.detailLines.length > 0 && (
                <div className={clsx(
                    'p-3 rounded-lg mb-4 text-xs space-y-1.5 border font-mono',
                    isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'
                )}>
                    {point.detailLines.map((line, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2">
                            <span>{line}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Action Buttons: Directions, Call */}
            {point.actions && point.actions.length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {point.actions.map((action) => {
                        const isPhone = action.href?.startsWith('tel:');
                        const isNav = action.href?.includes('maps.google.com') || action.label.toLowerCase().includes('yol') || action.label.toLowerCase().includes('harita');

                        return (
                            <a
                                key={action.id}
                                href={sanitizeUrl(action.href)}
                                target={action.external ? '_blank' : undefined}
                                rel={action.external ? 'noreferrer noopener' : undefined}
                                className={clsx(
                                    'flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-semibold text-xs transition-colors min-h-[44px]',
                                    isNav
                                        ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm'
                                        : isPhone
                                            ? isDarkMode
                                                ? 'bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-700'
                                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                                            : isDarkMode
                                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                )}
                            >
                                {isNav && <Navigation size={14} />}
                                {isPhone && <Phone size={14} />}
                                <span>{action.label}</span>
                            </a>
                        );
                    })}
                </div>
            )}
        </aside>
    );
};
