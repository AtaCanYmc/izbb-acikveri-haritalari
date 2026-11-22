import {Helmet} from 'react-helmet-async';
import {safeJsonStringify} from '../utils/security.ts';

interface SEOMetadataProps {
    title: string;
    description: string;
    keywords: string;
    url?: string;
    image?: string;
    category?: string;
    mapId?: string;
}

const DEFAULT_ORIGIN = 'https://www.izmirnobetcieczaneharitasi.live';
const DEFAULT_IMAGE = `${DEFAULT_ORIGIN}/logo.svg`;

export const SEOMetadata = ({
    title,
    description,
    keywords,
    url = DEFAULT_ORIGIN,
    image = DEFAULT_IMAGE,
    category,
    mapId,
}: SEOMetadataProps) => {
    // Generate Schema.org Structured Data (JSON-LD)
    const jsonLdGraph: Record<string, unknown>[] = [
        {
            '@type': 'WebSite',
            '@id': `${DEFAULT_ORIGIN}/#website`,
            url: DEFAULT_ORIGIN,
            name: 'İzmir Açık Veri Harita Atlası',
            description: 'İzmir Büyükşehir Belediyesi açık verilerini interaktif haritalar üzerinde keşfedin.',
            inLanguage: 'tr-TR',
            potentialAction: {
                '@type': 'SearchAction',
                target: `${DEFAULT_ORIGIN}/?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
            },
        },
        {
            '@type': 'WebApplication',
            '@id': `${DEFAULT_ORIGIN}/#webapp`,
            name: title,
            url,
            description,
            applicationCategory: 'MapApplication',
            operatingSystem: 'All',
            browserRequirements: 'Requires JavaScript. Requires HTML5.',
            inLanguage: 'tr-TR',
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'TRY',
            },
            provider: {
                '@type': 'GovernmentOrganization',
                name: 'İzmir Büyükşehir Belediyesi Açık Veri Portalı',
                url: 'https://acikveri.bizizmir.com',
            },
        },
    ];

    if (mapId && category) {
        jsonLdGraph.push({
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Ana Sayfa',
                    item: DEFAULT_ORIGIN,
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: category,
                    item: `${DEFAULT_ORIGIN}/?category=${encodeURIComponent(category)}`,
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: title,
                    item: url,
                },
            ],
        });
    }

    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': jsonLdGraph,
    };

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:site_name" content="İzmir Açık Veri Haritaları" />
            <meta property="og:locale" content="tr_TR" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:alt" content={title} />
            <meta property="og:image:width" content="512" />
            <meta property="og:image:height" content="512" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:image:alt" content={title} />

            {/* Schema.org Structured Data */}
            <script type="application/ld+json">
                {safeJsonStringify(structuredData)}
            </script>
        </Helmet>
    );
};
