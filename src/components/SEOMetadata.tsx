import {Helmet} from 'react-helmet-async';

interface SEOMetadataProps {
    title: string;
    description: string;
    keywords: string;
    url?: string;
}

export const SEOMetadata = ({title, description, keywords, url = 'https://www.izmirnobetcieczaneharitasi.live'}: SEOMetadataProps) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description}/>
            <meta name="keywords" content={keywords}/>

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={url}/>
            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image"/>
            <meta property="twitter:url" content={url}/>
            <meta property="twitter:title" content={title}/>
            <meta property="twitter:description" content={description}/>
            
            <link rel="canonical" href={url} />
        </Helmet>
    );
};
