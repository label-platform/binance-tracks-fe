import { NATIVE_EVENT } from '@constants/native-event';
import { InventoryListParams } from '@models/api-collections.interface';
import { ATTRIBUTE_GUARD, ITEM_STATUS } from '@models/common.interface';
import { createHeadphoneBox, HeadphoneBox } from '@models/headphone-box/headphone-box';
import { createHeadphone, Headphone } from '@models/headphone/headphone';
import { createMysteryBox, MysteryBox } from '@models/mystery-box/mystery-box';
import { createSticker, Sticker } from '@models/sticker/sticker';
import { core } from '@utils/core/core';
import { sendToNative } from '@utils/native';
import { useMemo, useRef } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { infinityQueryOption } from './common';

enum QueryKey {
    Headphone = 'Headphone',
    HeadphoneBox = 'HeadphoneBox',
    MysteryBox = 'MysteryBox',
    Sticker = 'Sticker',
    LuckyBox = 'LuckyBox',
}

export { QueryKey as InventoryQueryKey };

export const useHeadphoneListQuery = (params: InventoryListParams) => {
    const isPrevRefetching = useRef(false);
    const {
        data = { pages: [] },
        isLoading,
        isError,
        fetchNextPage,
        fetchPreviousPage,
        refetch,
        isRefetching,
        isRefetchError,
    } = useInfiniteQuery(
        [QueryKey.Headphone, 'list', params],
        async ({ pageParam = 1 }) => {
            return await core.inventory.headphone.getList({ page: pageParam, ...params });
        },
        infinityQueryOption
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
            (accu, page) => [...accu, ...page.content.data.map((headphone) => createHeadphone(headphone))],
            []
        ) as Headphone[],
        isLoading,
        isError,
        fetchNextPage,
        fetchPreviousPage,
        refetch,
        isRefetchSuccess,
    };
};

export const useHeadphoneSingleQuery = (itemId: string) => {
    const {
        data = { content: {} },
        isLoading,
        refetch,
        isSuccess,
    } = useQuery(
        [QueryKey.Headphone, 'detail', itemId],
        async () => {
            return await core.inventory.headphone.getSingle(itemId);
        },
        {
            enabled: typeof itemId === 'string',
        }
    );

    const { content: headphone } = data;

    return {
        headphone: createHeadphone(headphone) as Headphone,
        isLoading,
        refetch,
        isSuccess,
    };
};

export const useHeadphoneListeningQuery = () => {
    const {
        data = { content: {} },
        isLoading,
        refetch,
    } = useQuery([QueryKey.Headphone, 'listening'], async () => {
        return await core.inventory.headphone.getListeningHeadphone();
    });

    const { content: headphone } = data;

    return {
        headphone: createHeadphone(headphone) as Headphone,
        isLoading,
        refetch,
    };
};

export const useHeadphoneCalculateLevelupCostQuery = (headphoneId: string) => {
    const {
        data = { content: {} },
        isLoading,
        isError,
    } = useQuery([QueryKey.Headphone, 'level-up', headphoneId], async () => {
        return await core.inventory.headphone.getCalculateLevelUp(headphoneId);
    });
    const { content: levelUpCost } = data;
    return { levelUpCost, isLoading, isError };
};

export const useRequestHeadphoneLevelupQuery = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        ({ headphoneId }: { headphoneId: string }) => {
            return core.inventory.headphone.requestLevelUp(headphoneId);
        },
        {
            onSuccess(_data, variable) {
                queryClient.invalidateQueries([QueryKey.Headphone, 'detail', variable.headphoneId]);
            },
        }
    );

    return { mutate, isLoading };
};

export const useConfirmHeadphoneLevelupQuery = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        ({ headphoneId }: { headphoneId: string }) => {
            return core.inventory.headphone.confirmLevelUp(headphoneId);
        },
        {
            onSuccess(_data, variable) {
                queryClient.invalidateQueries([QueryKey.Headphone, 'detail', variable.headphoneId]);
            },
        }
    );

    return { mutate, isLoading };
};

export const useHeadphoneCalculateLevelupBoostCostQuery = (headphone: Headphone) => {
    const {
        data = { content: {} },
        isLoading,
        isError,
    } = useQuery(
        [QueryKey.Headphone, 'boost', headphone.id],
        async () => {
            return await core.inventory.headphone.getCalculateLevelUpBoost(headphone.id);
        },
        {
            enabled: headphone.status === ITEM_STATUS.LEVELING,
        }
    );
    const { content: levelUpBoostCost } = data;
    return { levelUpBoostCost, isLoading, isError };
};

export const useHeadphoneReleaseCoolDown = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        ({ headphoneId }: { headphoneId: string }) => {
            return core.inventory.headphone.releaseCoolDown(headphoneId);
        },
        {
            onSuccess(_data, variable) {
                queryClient.invalidateQueries([QueryKey.Headphone, 'detail', variable.headphoneId]);
            },
        }
    );
    return { mutate, isLoading };
};

export const useHeadphoneLevelupBoostQuery = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        ({ headphoneId }: { headphoneId: string }) => {
            return core.inventory.headphone.boostLevelUp(headphoneId);
        },
        {
            onSuccess(_data, variable) {
                queryClient.invalidateQueries([QueryKey.Headphone, 'detail', variable.headphoneId]);
            },
        }
    );
    return { mutate, isLoading };
};

export const useHeadphoneCalculateMintCostQuery = (headphoneId1: string, headphoneId2: string) => {
    const {
        data = { content: {} },
        isLoading,
        refetch,
    } = useQuery(
        [QueryKey.Headphone, 'calculate/mint/cost', headphoneId1, headphoneId2],
        async () => {
            return await core.inventory.headphone.getCalculateMint(headphoneId1, headphoneId2);
        },
        {
            enabled: !headphoneId2,
        }
    );
    const { content: mintCost } = data;
    return { mintCost, isLoading, refetch };
};

export const useHeadphoneMintQuery = () => {
    const {
        data = { content: {} },
        mutate,
        isLoading,
    } = useMutation((headphoneIds: string[]) => {
        return core.inventory.headphone.mint(headphoneIds);
    });

    const { content: mint } = data;
    return { mint, mutate, isLoading };
};

export const useHeadphoneCalculateChargeBattery = (headphone: Headphone) => {
    const { data = { content: {} }, isLoading } = useQuery(
        [QueryKey.Headphone, 'chargeBattery', headphone.id],
        async () => {
            return await core.inventory.headphone.getCalculateChargeBettery(headphone.id);
        },
        {
            enabled: headphone?.id ? headphone.status === ITEM_STATUS.IDLE && headphone.battery < 100 : false,
        }
    );
    const { content: chargeBatteryCost } = data;

    return { chargeBatteryCost, isLoading };
};

export const useHeadphoneChargeBattery = () => {
    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(
        ({ headphoneId, chargingAmount }: { headphoneId: string; chargingAmount: number }) => {
            return core.inventory.headphone.charge(headphoneId, chargingAmount);
        },
        {
            onSettled(_data, _error, params) {
                queryClient.invalidateQueries([QueryKey.Headphone, 'detail', params.headphoneId]);
            },
        }
    );

    return { mutate, isLoading };
};

export const useMysteryBoxListQuery = (params: InventoryListParams) => {
    const { data = { content: { data: [] } }, isLoading } = useQuery(
        [QueryKey.MysteryBox, 'list', params],
        async () => {
            return await core.inventory.mysteryBox.getList(params);
        }
    );

    return {
        data: data.content.data.map((box) => createMysteryBox(box)) as MysteryBox[],
        isLoading,
    };
};

export const useMysteryBoxSingleQuery = (itemId: string) => {
    return useQuery([QueryKey.MysteryBox, 'detail', itemId], async () => {
        return await core.inventory.headphone.getSingle(itemId);
    });
};

export const useMysteryBoxCostQuery = (itemId: string, isBoost?: boolean) => {
    const {
        data = { content: {} },
        isLoading,
        isSuccess,
    } = useQuery(
        [QueryKey.MysteryBox, 'cost', itemId, isBoost],
        async () => {
            return await (isBoost
                ? core.inventory.mysteryBox.calculateBoost(itemId)
                : core.inventory.mysteryBox.calculateOpen(itemId));
        },
        { enabled: !!itemId }
    );
    const cost = Array.isArray(data.content?.costs) ? data.content?.costs[0] : null;
    return {
        data: cost,
        isLoading,
        isSuccess,
    };
};

export const useMysteryBoxOpen = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        ({ itemId, isBoost }: { itemId: string; isBoost: boolean }) => {
            return isBoost ? core.inventory.mysteryBox.openBoost(itemId) : core.inventory.mysteryBox.open(itemId);
        },
        {
            onSettled() {
                queryClient.invalidateQueries([QueryKey.MysteryBox, 'list']);
            },
        }
    );

    return {
        mutate,
        isLoading,
    };
};

export const useHeadphoneBoxListQuery = (params: InventoryListParams) => {
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
        [QueryKey.HeadphoneBox, 'list', params],
        async ({ pageParam = 1 }) => {
            return await core.inventory.headphoneBox.getList({ page: pageParam, ...params });
        },
        infinityQueryOption
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
            (accu, page) => [...accu, ...page.content.data.map((box) => createHeadphoneBox(box))],
            []
        ) as HeadphoneBox[],
        isLoading,
        isError,
        fetchNextPage,
        fetchPreviousPage,
        refetch,
        isRefetchSuccess,
    };
};

export const useHeadphoneBoxSingleQuery = (itemId: string) => {
    return useQuery([QueryKey.HeadphoneBox, 'detail', itemId], async () => {
        return await core.inventory.headphoneBox.getSingle(itemId);
    });
};

export const useHeadphoneBoxOpenQuery = () => {
    const queryClient = useQueryClient();
    const {
        data = { content: {} },
        mutate,
        isLoading,
    } = useMutation(
        (headphoneBoxId: string) => {
            return core.inventory.headphoneBox.openHeadphoneBox(headphoneBoxId);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([QueryKey.HeadphoneBox, 'list']);
            },
        }
    );

    const { content: newHeadphone } = data;
    return {
        newHeadphone: new Headphone(newHeadphone),
        mutate,
        isLoading,
    };
};

export const useStickerListQuery = (params: InventoryListParams) => {
    const isPrevRefetching = useRef(false);
    const {
        data = { pages: [] },
        isLoading,
        isError,
        fetchNextPage,
        fetchPreviousPage,
        isRefetching,
        isRefetchError,
        refetch,
    } = useInfiniteQuery(
        [QueryKey.Sticker, 'list', 6],
        async ({ pageParam = 1 }) => {
            return await core.inventory.sticker.getList({ page: pageParam, ...params });
        },
        infinityQueryOption
    );

    const { pages = [] } = data;

    const isRefetchSuccess = useMemo(() => {
        if (isPrevRefetching.current && !isRefetching && !isRefetchError) {
            return true;
        }
        isPrevRefetching.current = isRefetching;
        return false;
    }, [isRefetching, isRefetchError]);

    return {
        data: pages.reduce(
            (accu, page) => [...accu, ...page.content.data.map((sticker) => createSticker(sticker))],
            []
        ) as Sticker[],
        isLoading,
        isError,
        fetchNextPage,
        fetchPreviousPage,
        isRefetchSuccess,
        refetch,
    };
};

export const useStickerListByAttributeQuery = (params: InventoryListParams, attribute?: ATTRIBUTE_GUARD) => {
    const {
        data = { pages: [] },
        isLoading,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery(
        [QueryKey.Sticker, 'list', params, attribute],
        async ({ pageParam = 1 }) => {
            return await core.inventory.sticker.getListByAttribute({
                page: pageParam,
                ...params,
                attribute: attribute.toUpperCase() as Uppercase<ATTRIBUTE_GUARD>,
            });
        },
        { ...infinityQueryOption, enabled: !!attribute }
    );

    const { pages = [] } = data;

    return {
        data: pages.reduce(
            (accu, page) => [...accu, ...page.content.data.map((sticker) => createSticker(sticker))],
            []
        ) as Sticker[],
        isLoading,
        fetchNextPage,
        fetchPreviousPage,
    };
};

export const useStickerSingleQuery = (itemId: string) => {
    return useQuery([QueryKey.Sticker, 'detail', itemId], async () => {
        return await core.inventory.sticker.getSingle(itemId);
    });
};

export const useCostToOpenHeadphoneDock = (headphoneId: string, dockPosition: number) => {
    const { data = { content: {} }, isLoading } = useQuery(
        [QueryKey.Headphone, 'dock', headphoneId],
        async () => {
            return core.inventory.headphone.getCalculatedOpenHeadphoneDock(headphoneId, dockPosition);
        },
        { enabled: dockPosition !== undefined }
    );
    const { content: openDockCost, success } = data;
    return { openDockCost, isLoading, success };
};

export const useOpenHeadphoneDock = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        ({ headphoneId, dockPosition }: { headphoneId: string; dockPosition: number }) => {
            return core.inventory.headphone.putOpenHeadphoneDock(headphoneId, dockPosition);
        },
        {
            onSettled(_data, _error, params) {
                queryClient.invalidateQueries([QueryKey.Headphone, 'detail', params.headphoneId]);
            },
        }
    );
    return { mutate, isLoading };
};

export const useMountHeadphone = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        ({ headphoneId }: { headphoneId: string }) => {
            return core.inventory.headphone.mount(headphoneId);
        },
        {
            onSuccess(data) {
                queryClient.invalidateQueries([QueryKey.Headphone]);
                sendToNative({ name: NATIVE_EVENT.SET_LISTENING_HEADPHONE, params: data.content });
            },
        }
    );
    return { mutate, isLoading };
};

export const useInsertSticker = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        ({
            headphoneId,
            dockPosition,
            stickerId,
        }: {
            headphoneId: string;
            dockPosition: number;
            stickerId: string;
        }) => {
            return core.inventory.sticker.insert(headphoneId, dockPosition, stickerId);
        },
        {
            onSettled(_data, _error, params) {
                queryClient.invalidateQueries([QueryKey.Headphone, 'detail', params.headphoneId]);
            },
        }
    );
    return { mutate, isLoading };
};

export const useRemoveSticker = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        ({
            headphoneId,
            dockPosition,
            stickerId,
        }: {
            headphoneId: string;
            dockPosition: number;
            stickerId: string;
        }) => {
            return core.inventory.sticker.remove(headphoneId, dockPosition, stickerId);
        },
        {
            onSettled(_data, _error, params) {
                queryClient.invalidateQueries([QueryKey.Headphone, 'detail', params.headphoneId]);
            },
        }
    );
    return { mutate, isLoading };
};

export const useStatUpHeadphone = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        ({ headphoneId, points }: { headphoneId: string; points: Record<ATTRIBUTE_GUARD, number> }) => {
            return core.inventory.headphone.statUp(headphoneId, points);
        },
        {
            onSettled(_data, _error, params) {
                queryClient.invalidateQueries([QueryKey.Headphone, 'detail', params.headphoneId]);
            },
        }
    );
    return { mutate, isLoading };
};
