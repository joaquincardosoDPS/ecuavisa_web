import { useState, useEffect } from "react";

/**
 * Preloads an array of image URLs in the background.
 * Returns `true` only when every image has been loaded (or failed).
 *
 * @param urls - Image URLs to preload. Pass an empty array while data is loading.
 * @param enabled - Set to `false` to skip preloading (e.g. while data is still fetching).
 */
export function useImagePreloader(urls: string[], enabled = true): boolean {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!enabled || urls.length === 0) {
            setReady(false);
            return;
        }

        let cancelled = false;

        const promises = urls.map(
            (src) =>
                new Promise<void>((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = () => resolve(); // Don't block on broken images
                    img.src = src;
                }),
        );

        Promise.all(promises).then(() => {
            if (!cancelled) setReady(true);
        });

        return () => {
            cancelled = true;
        };
    }, [urls, enabled]);

    return ready;
}
