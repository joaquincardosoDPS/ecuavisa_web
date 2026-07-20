import { useEffect, useRef } from 'react';

/**
 * Hook que ejecuta un callback cuando un elemento centinela
 * entra en el viewport (IntersectionObserver).
 * Devuelve un ref para asignar al elemento centinela.
 */
export function useInfiniteScroll(
    callback: () => void,
    enabled: boolean,
) {
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!enabled) return;
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    callback();
                }
            },
            { rootMargin: '200px' },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [callback, enabled]);

    return sentinelRef;
}
