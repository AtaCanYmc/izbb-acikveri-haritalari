import type {MapPoint} from '../types/mapData.ts';

interface SelectedPointCardProps {
    point: MapPoint | null;
    onClose: () => void;
}

export const SelectedPointCard = ({point, onClose}: SelectedPointCardProps) => {
    if (!point) {
        return null;
    }

    return (
        <div className="absolute bottom-8 right-8 z-[1000] w-80 hidden md:block">
            <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100">
                <div className="flex justify-between items-start mb-4 gap-3">
                    <div>
                        <h2 className="font-bold text-xl text-slate-900">{point.title}</h2>
                        {point.badge && <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">{point.badge}</p>}
                    </div>
                    <button onClick={onClose} className="text-slate-300 hover:text-slate-500">✕</button>
                </div>

                {point.subtitle && <p className="text-xs text-slate-600 mb-4 leading-relaxed italic">{point.subtitle}</p>}
                {point.description && <p className="text-xs text-slate-500 mb-4">{point.description}</p>}

                <div className="flex flex-col gap-2 mb-4">
                    {point.detailLines.map((line) => (
                        <p key={line} className="text-[11px] text-slate-500">{line}</p>
                    ))}
                </div>

                <div className="flex gap-2">
                    {point.actions?.map((action) => (
                        <a
                            key={action.id}
                            href={action.href}
                            target={action.external ? '_blank' : undefined}
                            rel={action.external ? 'noreferrer' : undefined}
                            className="flex-1 bg-slate-900 text-white text-center py-3 rounded-xl font-bold text-xs"
                        >
                            {action.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

