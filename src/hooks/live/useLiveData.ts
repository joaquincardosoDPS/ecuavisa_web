import { useLiveChannels } from '@/hooks/live/useLiveChannels';
import { useLiveEpg } from '@/hooks/live/useLiveEpg';


export const useLiveData = () => {

    const channelsQuery = useLiveChannels();
    const epgQuery = useLiveEpg();

    return {
        playlistPremium: channelsQuery.data || [],
        epg: epgQuery.data || [],
        isLoading: channelsQuery.isLoading || epgQuery.isLoading,
        isError: channelsQuery.isError || epgQuery.isError
    };
};
