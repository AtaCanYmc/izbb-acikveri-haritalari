export interface CategoryConfig {
    name: string;
    iconUrl: string;
    description: string;
    badgeClass: string;
    borderHoverClass: string;
    headerGradient: string;
    iconBgClass: string;
    accentColor: string;
}

export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
    'Sağlık': {
        name: 'Sağlık',
        iconUrl: '/images/categories/saglik.svg',
        description: 'Eczaneler, hastaneler, aile sağlığı ve veteriner merkezleri',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800',
        borderHoverClass: 'hover:border-emerald-400 dark:hover:border-emerald-600',
        headerGradient: 'from-emerald-500/15 via-teal-500/10 to-transparent dark:from-emerald-900/30 dark:via-teal-900/20 dark:to-transparent',
        iconBgClass: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
        accentColor: '#059669',
    },
    'Ulaşım': {
        name: 'Ulaşım',
        iconUrl: '/images/categories/ulasim.svg',
        description: 'Otopark dolulukları, vapur iskeleleri, tren garları ve taksi durakları',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-400 dark:border-sky-800',
        borderHoverClass: 'hover:border-sky-400 dark:hover:border-sky-600',
        headerGradient: 'from-sky-500/15 via-blue-500/10 to-transparent dark:from-sky-900/30 dark:via-blue-900/20 dark:to-transparent',
        iconBgClass: 'bg-sky-100/80 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
        accentColor: '#0284c7',
    },
    'Afet': {
        name: 'Afet',
        iconUrl: '/images/categories/afet.svg',
        description: 'Acil durum ve deprem toplanma alanları',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
        borderHoverClass: 'hover:border-amber-400 dark:hover:border-amber-600',
        headerGradient: 'from-amber-500/15 via-orange-500/10 to-transparent dark:from-amber-900/30 dark:via-orange-900/20 dark:to-transparent',
        iconBgClass: 'bg-amber-100/80 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
        accentColor: '#d97706',
    },
    'Dijital Hizmetler': {
        name: 'Dijital Hizmetler',
        iconUrl: '/images/categories/dijital.svg',
        description: 'Ücretsiz WiZmirNET kablosuz internet bağlantı noktaları',
        badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-800',
        borderHoverClass: 'hover:border-cyan-400 dark:hover:border-cyan-600',
        headerGradient: 'from-cyan-500/15 via-teal-500/10 to-transparent dark:from-cyan-900/30 dark:via-teal-900/20 dark:to-transparent',
        iconBgClass: 'bg-cyan-100/80 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
        accentColor: '#0891b2',
    },
    'Eğitim': {
        name: 'Eğitim',
        iconUrl: '/images/categories/egitim.svg',
        description: 'Üniversiteler, liseler ve anaokulları',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800',
        borderHoverClass: 'hover:border-indigo-400 dark:hover:border-indigo-600',
        headerGradient: 'from-indigo-500/15 via-purple-500/10 to-transparent dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-transparent',
        iconBgClass: 'bg-indigo-100/80 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
        accentColor: '#4f46e5',
    },
    'Kültür': {
        name: 'Kültür',
        iconUrl: '/images/categories/kultur.svg',
        description: 'Müzeler, kütüphaneler, tiyatro, sinema, opera ve salonlar',
        badgeClass: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-400 dark:border-violet-800',
        borderHoverClass: 'hover:border-violet-400 dark:hover:border-violet-600',
        headerGradient: 'from-violet-500/15 via-purple-500/10 to-transparent dark:from-violet-900/30 dark:via-purple-900/20 dark:to-transparent',
        iconBgClass: 'bg-violet-100/80 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
        accentColor: '#7c3aed',
    },
    'Rekreasyon': {
        name: 'Rekreasyon',
        iconUrl: '/images/categories/rekreasyon.svg',
        description: 'Mavi bayraklı plajlar, kaplıcalar, hamamlar ve fuar alanları',
        badgeClass: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-400 dark:border-teal-800',
        borderHoverClass: 'hover:border-teal-400 dark:hover:border-teal-600',
        headerGradient: 'from-teal-500/15 via-emerald-500/10 to-transparent dark:from-teal-900/30 dark:via-emerald-900/20 dark:to-transparent',
        iconBgClass: 'bg-teal-100/80 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
        accentColor: '#0d9488',
    },
    'Tarih': {
        name: 'Tarih',
        iconUrl: '/images/categories/tarih.svg',
        description: 'Antik kentler, anıtlar, köşkler, tarihi hanlar ve su yapıları',
        badgeClass: 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700',
        borderHoverClass: 'hover:border-stone-400 dark:hover:border-stone-600',
        headerGradient: 'from-stone-500/15 via-amber-700/10 to-transparent dark:from-stone-900/30 dark:via-amber-950/20 dark:to-transparent',
        iconBgClass: 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300',
        accentColor: '#78716c',
    },
    'Yaşam': {
        name: 'Yaşam',
        iconUrl: '/images/categories/yasam.svg',
        description: 'Semt pazarları ve günlük kentsel yaşam merkezleri',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800',
        borderHoverClass: 'hover:border-blue-400 dark:hover:border-blue-600',
        headerGradient: 'from-blue-500/15 via-indigo-500/10 to-transparent dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-transparent',
        iconBgClass: 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
        accentColor: '#2563eb',
    },
    'Yönetim': {
        name: 'Yönetim',
        iconUrl: '/images/categories/yonetim.svg',
        description: 'Muhtarlıklar ve resmi yerel yönetim birimleri',
        badgeClass: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        borderHoverClass: 'hover:border-slate-400 dark:hover:border-slate-600',
        headerGradient: 'from-slate-500/15 via-zinc-500/10 to-transparent dark:from-slate-900/30 dark:via-zinc-900/20 dark:to-transparent',
        iconBgClass: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
        accentColor: '#64748b',
    },
    'Belediye': {
        name: 'Belediye',
        iconUrl: '/images/categories/yonetim.svg',
        description: 'İzmir Büyükşehir Belediyesi doğrudan hizmet binaları ve merkezleri',
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
        borderHoverClass: 'hover:border-sky-400 dark:hover:border-sky-600',
        headerGradient: 'from-sky-600/15 via-blue-600/10 to-transparent dark:from-sky-900/30 dark:via-blue-900/20 dark:to-transparent',
        iconBgClass: 'bg-sky-100/80 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
        accentColor: '#0284c7',
    },
};

const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
    name: 'Kategori',
    iconUrl: '/images/categories/kultur.svg',
    description: 'Şehir açık veri katmanı',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    borderHoverClass: 'hover:border-slate-400 dark:hover:border-slate-600',
    headerGradient: 'from-slate-500/10 via-slate-500/5 to-transparent dark:from-slate-800/20 dark:to-transparent',
    iconBgClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    accentColor: '#0284c7',
};

export const getCategoryConfig = (category: string): CategoryConfig => {
    return CATEGORY_CONFIGS[category] || {
        ...DEFAULT_CATEGORY_CONFIG,
        name: category,
    };
};
