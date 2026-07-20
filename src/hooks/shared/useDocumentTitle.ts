import { useEffect } from 'react';
import { useConfigStore } from '@/features/config/useConfigStore';

/**
 *  Actualiza `document.title` y meta tags SEO (description, og:*, canonical)
 *  de forma dinámica para cada página.
 *  Restaura los valores base al desmontar el componente.
 */

interface SEOOptions {
  /** Descripción de la página para Google y redes sociales */
  description?: string;
  /** URL de imagen para OpenGraph / Twitter Card */
  image?: string;
  /** URL canónica de la página (se auto-genera si no se pasa) */
  canonical?: string;
}

export function useDocumentTitle(
  pageTitle: string | undefined | null,
  seoOptions?: SEOOptions
): void {
  const appName = useConfigStore((s) => s.config?.name);

  useEffect(() => {
    if (!pageTitle) return;

    const fullTitle = appName ? `${pageTitle} | ${appName}` : pageTitle;
    document.title = fullTitle;

    // --- Meta tags ---
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector<HTMLMetaElement>(selector);
      if (el) el.content = content;
    };

    // Description
    if (seoOptions?.description) {
      setMeta('meta[name="description"]', seoOptions.description);
      setMeta('meta[property="og:description"]', seoOptions.description);
      setMeta('meta[name="twitter:description"]', seoOptions.description);
    }

    // Title OG/Twitter
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[name="twitter:title"]', fullTitle);

    // Image
    if (seoOptions?.image) {
      setMeta('meta[property="og:image"]', seoOptions.image);
      setMeta('meta[name="twitter:image"]', seoOptions.image);
    }

    // Canonical
    const canonicalUrl = seoOptions?.canonical || window.location.href;
    const canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonicalEl) canonicalEl.href = canonicalUrl;
    setMeta('meta[property="og:url"]', canonicalUrl);

    return () => {
      if (appName) document.title = appName;
    };
  }, [pageTitle, appName, seoOptions?.description, seoOptions?.image, seoOptions?.canonical]);
}
