import {useEffect} from 'react';
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
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4 gap-3">
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">{point.title}</h2>
                        {point.badge && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-wider">{point.badge}</p>}
                    </div>
                    <button onClick={onClose} className="text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400">✕</button>
                </div>

                {point.subtitle && <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed italic">{point.subtitle}</p>}
                {point.description && <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{point.description}</p>}

                <div className="flex flex-col gap-2 mb-4">
                    {point.detailLines.map((line) => (
                        <p key={line} className="text-[11px] text-slate-500 dark:text-slate-400">{line}</p>
                    ))}
                </div>

                <div className="flex gap-2">
                    {point.actions?.map((action) => (
                        <a
                            key={action.id}
                            href={action.href}
                            target={action.external ? '_blank' : undefined}
                            rel={action.external ? 'noreferrer' : undefined}
                            className="flex-1 bg-slate-900 dark:bg-red-600 text-white text-center py-3 rounded-xl font-bold text-xs"
                        >
                            {action.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

