interface UseAdsPolicyOptions {
    vastUrl?: string;
}

export function useAdsPolicy({ vastUrl }: UseAdsPolicyOptions) {
    const hasValidVastUrl = !!vastUrl && vastUrl !== 'none' && vastUrl.trim() !== '';

    return {
        shouldPlayAds: hasValidVastUrl,
        effectiveVastUrl: hasValidVastUrl ? vastUrl : undefined,
        evaluated: true,
    };
}
