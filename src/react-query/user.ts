import { SECOND } from '@constants/common';
import { createUser, User } from '@models/user/user';
import { core } from '@utils/core/core';
import { useMutation, useQuery, useQueryClient } from 'react-query';

enum QueryKey {
    SelfInfo = 'SelfInfo',
    SelfBalance = 'SelfBalance',
    SelfActivationCodes = 'SelfActivationCodes',
}

export { QueryKey as UserQueryKey };

export const useUserSelfInfoQuery = () => {
    const {
        data = {},
        isLoading,
        isSuccess,
        refetch,
    } = useQuery(
        [QueryKey.SelfInfo],
        async () => {
            return await core.user.getSelf();
        },
        { cacheTime: SECOND * 60 * 15 }
    );
    let user = data?.content;

    if (user) {
        user = {
            ...user,
        };
    }

    return {
        user: createUser(user) as User,
        refetch,
        isLoading,
        isSuccess,
    };
};

export const useUserRegistWalletAddress = () => {
    const queryClient = useQueryClient();
    const { mutate, isSuccess } = useMutation(
        async (address: string) => {
            return core.user.registWalletAddress(address);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([QueryKey.SelfInfo]);
            },
        }
    );

    return {
        mutate,
        isSuccess,
    };
};

export const useUserBalanceQuery = () => {
    const {
        data = {},
        isLoading,
        refetch,
    } = useQuery(
        [QueryKey.SelfBalance],
        async () => {
            return await core.spendingBalance.getBalancesByJWT();
        },
        { cacheTime: SECOND * 60 * 15 }
    );

    const balances = data?.content || [];

    return {
        balances,
        refetch,
        isLoading,
    };
};

export const useUpdateUserName = () => {
    const queryClient = useQueryClient();
    const { mutate, isSuccess } = useMutation(
        async (name: string) => {
            return await core.user.updateUserName(name);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([QueryKey.SelfInfo]);
            },
        }
    );
    return {
        mutate,
        isSuccess,
    };
};

export const useUserActivationCodesQuery = () => {
    const { data, isLoading } = useQuery(
        [QueryKey.SelfActivationCodes],
        async () => {
            return await core.activationcode.getList();
        },
        { cacheTime: SECOND * 60 * 15 }
    );

    return {
        activationCodes: (data?.content || []) as any[],
        isLoading,
    };
};
