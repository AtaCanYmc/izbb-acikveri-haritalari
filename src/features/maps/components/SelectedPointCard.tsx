import {useEffect} from 'react';
import clsx from 'clsx';
import type {MapPoint} from '../types/mapData.ts';

interface SelectedPointCardProps {
    point: MapPoint | null;
    onClose: () => void;
    isDarkMode?: boolean;
}

export const SelectedPointCard = ({point, onClose, isDarkMode}: SelectedPointCardProps) => {
    // Force reflow when dark mode changes to ensure Tailwind classes are applied
    useEffect(() => {
        void document.documentElement.offsetHeight;
    }, [isDarkMode]);

    if (!point) {
        return null;
    }

    return (
        <div className="absolute bottom-8 right-8 z-[1000] w-80 hidden md:block">
            <div className={clsx(
                'p-6 rounded-[2rem] shadow-2xl border',
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
            )}>
                <div className="flex justify-between items-start mb-4 gap-3">
                    <div>
                        <h2 className={clsx('font-bold text-xl', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>{point.title}</h2>
                        {point.badge && <p className={clsx('text-xs mt-1 uppercase font-bold tracking-wider', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>{point.badge}</p>}
                    </div>
                    <button onClick={onClose} className={clsx('hover:text-slate-500', isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 dark:text-slate-600')}>✕</button>
                </div>

                {point.subtitle && <p className={clsx('text-xs mb-4 leading-relaxed italic', isDarkMode ? 'text-slate-300' : 'text-slate-600')}>{point.subtitle}</p>}
                {point.description && <p className={clsx('text-xs mb-4', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>{point.description}</p>}

                <div className="flex flex-col gap-2 mb-4">
                    {point.detailLines.map((line) => (
                        <p key={line} className={clsx('text-[11px]', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>{line}</p>
                    ))}
                </div>

                <div className="flex gap-2">
                    {point.actions?.map((action) => (
                        <a
                            key={action.id}
                            href={action.href}
                            target={action.external ? '_blank' : undefined}
                            rel={action.external ? 'noreferrer' : undefined}
                            className={clsx(
                                'flex-1 text-white text-center py-3 rounded-xl font-bold text-xs',
                                isDarkMode ? 'bg-red-600' : 'bg-slate-900'
                            )}
                        >
                            {action.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

