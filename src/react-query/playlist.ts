import { core } from '@utils/core/core';
import { useQuery } from 'react-query';
enum QueryKey {
    Playlist = 'playlist',
}

export const usePlaylistListQuery = () => {
    const {
        data = {
            content: {
                data: undefined,
                meta: undefined,
            },
        },
        isLoading,
        isError,
    } = useQuery([QueryKey.Playlist, 'list'], async () => {
        return core.playlist.getList();
    });
    const { content } = data;
    return { data: content.data, isLoading, isError };
};

export const usePlaylistSingleQuery = (playlistID: number) => {
    const {
        data = { content: {} },
        isError,
        isLoading,
    } = useQuery([QueryKey.Playlist, 'detail', playlistID], async () => {
        return core.playlist.getSingle(playlistID);
    });
    const [playlist] = data.content?.data || [];
    return {
        data: playlist,
        isError,
        isLoading,
    };
};
