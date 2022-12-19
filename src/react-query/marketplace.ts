import { MarketPlaceListParmas } from '@models/api-collections.interface';
import { createHeadphoneBox } from '@models/headphone-box/headphone-box';
import { createHeadphone } from '@models/headphone/headphone';
import { Item } from '@models/item/item';
import { createMerchandise, Merchandise } from '@models/merchandise/merchandise';
import { createSticker, Sticker } from '@models/sticker/sticker';
import { createTicket, Ticket } from '@models/ticket/ticket';
import { core } from '@utils/core/core';
import { useMemo, useRef } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { infinityQueryOption } from './common';
import { InventoryQueryKey } from './inventory';

const QUERYKEY = 'MARKET_PLACE';

export const useSellQuery = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        ({ itemId, price }: { itemId: string; price: number }) => {
            return core.marketPlace.sell(itemId, price);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([InventoryQueryKey.Headphone, 'detail']);
            },
        }
    );
    return { mutate, isLoading };
};

export const useUpdateSellQuery = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        ({ sellId, price }: { sellId: string; price: number }) => {
            return core.marketPlace.updateSell(sellId, price);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([InventoryQueryKey.Headphone, 'detail']);
            },
        }
    );
    return { mutate, isLoading };
};

export const useCancelSellQuery = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        ({ sellId }: { sellId: string }) => {
            return core.marketPlace.cancelSell(sellId);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([InventoryQueryKey.Headphone, 'detail']);
                queryClient.invalidateQueries([InventoryQueryKey.Sticker, 'list']);
                queryClient.invalidateQueries([InventoryQueryKey.HeadphoneBox, 'list']);
            },
        }
    );
    return { mutate, isLoading };
};

export const useMarketPlaceHeadphoneQuery = ({ type = 'HEADPHONE', ...rest }: MarketPlaceListParmas) => {
    const isPrevRefetching = useRef(false);
    const {
        data = { pages: [] },
        isLoading,
        isError,
        isRefetchError,
        isRefetching,
        refetch,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery(
        [QUERYKEY, 'headphone-list', type, rest],
        async ({ pageParam = 1 }) => {
            return await core.marketPlace.getHeadphoneList({ page: pageParam, type, ...rest });
        },
        {
            ...infinityQueryOption,
        }
    );

    const isRefetchSuccess = useMemo(() => {
        if (isPrevRefetching.current && !isRefetching && !isRefetchError) {
            return true;
        }
        isPrevRefetching.current = isRefetching;
        return false;
    }, [isRefetching, isRefetchError]);

    const { pages } = data;

    return {
        data: pages.reduce(
            (accu, page) => [
                ...accu,
                ...page.content.data.map((item) => {
                    return type === 'HEADPHONE' ? createHeadphone(item) : createHeadphoneBox(item);
                }),
            ],
            []
        ) as Item[],
        isLoading,
        refetch,
        isError,
        isRefetchSuccess,
        fetchNextPage,
        fetchPreviousPage,
    };
};

export const useMarketPlaceMerchandiseQuery = ({ ...rest }: MarketPlaceListParmas) => {
    const isPrevRefetching = useRef(false);
    const {
        data = { pages: [] },
        isLoading,
        fetchNextPage,
        fetchPreviousPage,
        refetch,
        isError,
        isRefetchError,
        isRefetching,
    } = useInfiniteQuery(
        [QUERYKEY, 'merchandise-list', rest],
        async ({ pageParam = 1 }) => {
            return await core.marketPlace.getMerchandiseList({ page: pageParam, ...rest });
        },
        { ...infinityQueryOption }
    );

    const isRefetchSuccess = useMemo(() => {
        if (isPrevRefetching.current && !isRefetching && !isRefetchError) {
            return true;
        }
        isPrevRefetching.current = isRefetching;
        return false;
    }, [isRefetching, isRefetchError]);

    const { pages } = data;

    return {
        data: pages.reduce(
            (accu, page) => [
                ...accu,
                ...page.content.data.map((item) => {
                    return createMerchandise(item);
                }),
            ],
            []
        ) as Merchandise[],
        isLoading,
        isError,
        fetchNextPage,
        fetchPreviousPage,
        refetch,
        isRefetchSuccess,
    };
};
export const useMarketPlaceTicketQuery = ({ ...rest }: MarketPlaceListParmas) => {
    const isPrevRefetching = useRef(false);
    const {
        data = { pages: [] },
        isLoading,
        fetchNextPage,
        fetchPreviousPage,
        refetch,
        isError,
        isRefetchError,
        isRefetching,
    } = useInfiniteQuery(
        [QUERYKEY, 'ticket-list', rest],
        async ({ pageParam = 1 }) => {
            return await core.marketPlace.getTicketList({ page: pageParam, ...rest });
        },
        { ...infinityQueryOption }
    );

    const isRefetchSuccess = useMemo(() => {
        if (isPrevRefetching.current && !isRefetching && !isRefetchError) {
            return true;
        }
        isPrevRefetching.current = isRefetching;
        return false;
    }, [isRefetching, isRefetchError]);

    const { pages } = data;

    return {
        data: pages.reduce(
            (accu, page) => [
                ...accu,
                ...page.content.data.map((item) => {
                    return createTicket(item);
                }),
            ],
            []
        ) as Ticket[],
        isLoading,
        isError,
        fetchNextPage,
        fetchPreviousPage,
        refetch,
        isRefetchSuccess,
    };
};

export const useMarketPlaceStickerQuery = ({ ...rest }: MarketPlaceListParmas) => {
    const isPrevRefetching = useRef(false);
    const {
        data = { pages: [] },
        isLoading,
        fetchNextPage,
        fetchPreviousPage,
        refetch,
        isError,
        isRefetchError,
        isRefetching,
    } = useInfiniteQuery(
        [QUERYKEY, 'sticker-list', rest],
        async ({ pageParam = 1 }) => {
            return await core.marketPlace.getStickerList({ page: pageParam, ...rest });
        },
        { ...infinityQueryOption }
    );

    const isRefetchSuccess = useMemo(() => {
        if (isPrevRefetching.current && !isRefetching && !isRefetchError) {
            return true;
        }
        isPrevRefetching.current = isRefetching;
        return false;
    }, [isRefetching, isRefetchError]);

    const { pages } = data;

    return {
        data: pages.reduce(
            (accu, page) => [
                ...accu,
                ...page.content.data.map((item) => {
                    return createSticker(item);
                }),
            ],
            []
        ) as Sticker[],
        isLoading,
        isError,
        fetchNextPage,
        fetchPreviousPage,
        refetch,
        isRefetchSuccess,
    };
};

export const useBuyQuery = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        ({ itemId }: { itemId: string }) => {
            return core.marketPlace.buy(itemId);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([QUERYKEY]);
            },
        }
    );
    return { mutate, isLoading };
};
