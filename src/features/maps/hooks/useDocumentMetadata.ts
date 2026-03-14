import {useEffect} from "react";

interface DocumentMetadata {
    title: string;
    description: string;
    keywords: string;
}

const upsertMetaTag = (name: string, content: string) => {
    let meta = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

    if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
    }

    const previousContent = meta.getAttribute('content');
    meta.setAttribute('content', content);

    return () => {
        if (previousContent === null) {
            meta?.remove();
            return;
        }

        meta.setAttribute('content', previousContent);
    };
};

export const useDocumentMetadata = (metadata: DocumentMetadata) => {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = metadata.title;

        const restoreDescription = upsertMetaTag('description', metadata.description);
        const restoreKeywords = upsertMetaTag('keywords', metadata.keywords);

        return () => {
            document.title = previousTitle;
            restoreDescription();
            restoreKeywords();
        };
    }, [metadata.description, metadata.keywords, metadata.title]);
};

