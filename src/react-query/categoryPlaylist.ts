import { core } from '@utils/core/core';
import { useQuery } from 'react-query';
enum QueryKey {
    CategoryPlaylist = 'category-playlist',
}

export const useCategoryPlaylistQuery = () => {
    const {
        data = {
            content: {
                data: undefined,
                meta: undefined,
            },
        },
        isLoading,
        isError,
    } = useQuery([QueryKey.CategoryPlaylist, 'list'], async () => {
        return core.playlistcategory.getCategoryList();
    });
    const { content } = data;
    return { data: content.data, isLoading, isError };
};

export const useCategoryPlaylistSingleQuery = (categoryplaylistID: number) => {
    const {
        data = {
            content: {
                data: undefined,
                meta: undefined,
            },
        },
        isError,
        isLoading,
    } = useQuery([QueryKey.CategoryPlaylist, 'detail', categoryplaylistID], async () => {
        return core.playlistcategory.getSingleCategoryList(categoryplaylistID);
    });
    const [playlist] = data.content?.data || [];
    return {
        data: playlist,
        isError,
        isLoading,
    };
};
