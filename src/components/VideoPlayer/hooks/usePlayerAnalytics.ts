/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Stub de analytics del player.
 * TODO: Implementar tracking real cuando se defina el proveedor de analytics.
 */
export function usePlayerAnalytics(_rudoKey?: string, _episode?: unknown, _description?: string) {
    return {
        onPlaybackProgress: (_currentTime: number, _duration: number) => { },
        onAdStarted: () => { },
        onAdCompleted: () => { },
    };
}
