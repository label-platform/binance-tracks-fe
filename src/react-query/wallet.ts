import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
    ContractGuard,
    GasFeeProps,
    GasFeeToSpendingProps,
    WalletSingleTon,
    NFTTransferProps,
    TokenTransferProps,
    TokenTransferToSpendingProps,
    NFTTransferToSpendingProps,
} from '@services/wallet/wallet';
import { core } from '@utils/core/core';
import { InventoryQueryKey } from './inventory';

enum QueryKey {
    Transfer = 'Transfer',
    Histories = 'Histories',
}

export const useSendTokenSpendingToWallet = () => {
    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(
        ({ tokenSymbol, amount, signedMessage }: { tokenSymbol: string; amount: string; signedMessage: string }) => {
            return core.withdraw.sendToken(tokenSymbol, amount, signedMessage);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([QueryKey.Transfer, 'token']);
                queryClient.invalidateQueries([QueryKey.Histories]);
            },
        }
    );
    return { mutate, isLoading };
};
export const useTransferNftToWallet = () => {
    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(
        ({ itemType, itemId }: { itemType: ContractGuard; itemId: string }) => {
            return WalletSingleTon.getInstance().transferNftToWallet(itemType, itemId);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([InventoryQueryKey.HeadphoneBox]);
                queryClient.invalidateQueries([InventoryQueryKey.Headphone]);
            },
        }
    );
    return { mutate, isLoading };
};

export const useGetGasFee = () => {
    const { mutate, isLoading, data } = useMutation(async (props: GasFeeProps) => {
        const gasLimit = await WalletSingleTon.getInstance().getGasFee(props);
        return Number(gasLimit) / 10 ** 8;
    });
    return { mutate, isLoading, data };
};
export const useGetGasFeeToSpending = () => {
    const { mutate, isLoading, data } = useMutation(async (props: GasFeeToSpendingProps) => {
        const gasLimit = await WalletSingleTon.getInstance().getGasFeeToSpending(props);
        return Number(gasLimit) / 10 ** 8;
    });
    return { mutate, isLoading, data };
};

export const useGetTokenBalanceOfWallet = (contracts: Array<ContractGuard>) => {
    const { data, isLoading, refetch } = useQuery([QueryKey.Transfer, 'token', contracts.join('')], async () => {
        const responses = contracts.map((contract) => {
            return WalletSingleTon.getInstance().getBalanceByContract(contract);
        });

        const data = await Promise.all(responses);

        return contracts.reduce((prev, name, index) => {
            return {
                ...prev,
                [name]: data[index],
            };
        }, {});
    });

    return { refetch, isLoading, tokens: data as Record<ContractGuard, string> };
};

export const useGetNFTBalanceOfWallet = (contracts: Array<ContractGuard>) => {
    const { data, isLoading, refetch } = useQuery([QueryKey.Transfer, 'token', contracts.join('')], async () => {
        const responses = contracts.map((contract) => {
            return WalletSingleTon.getInstance().getNftByContract(contract);
        });

        const data = await Promise.all(responses);

        return contracts.reduce((prev, name, index) => {
            return {
                ...prev,
                [name]: data[index],
            };
        }, {});
    });
    return { refetch, isLoading, nfts: data as Record<ContractGuard, string> };
};

export const useGetNFTLIst = (contract: ContractGuard, isopen: boolean) => {
    const {
        data = { data: [] },
        isLoading,
        isError,
        refetch,
    } = useQuery(
        [QueryKey.Transfer, 'NFTList', contract],
        async () => {
            return await WalletSingleTon.getInstance().getNFTList(contract);
        },
        { enabled: isopen }
    );

    return {
        data,
        isLoading,
        isError,
        refetch,
    };
};

export const useSendTransferNFTTransaction = () => {
    const queryClient = useQueryClient();

    const { mutate, isLoading, data } = useMutation(
        async (props: NFTTransferProps) => {
            return await WalletSingleTon.getInstance().sendNFTToAddress(props);
        },
        {
            onSettled() {
                queryClient.invalidateQueries([QueryKey.Transfer, 'token']);
            },
        }
    );
    return { mutate, isLoading, data };
};

export const useSendTransferNFTToSpending = () => {
    const queryClient = useQueryClient();

    const { mutate, isLoading, data } = useMutation(
        async (props: NFTTransferToSpendingProps) => {
            return await WalletSingleTon.getInstance().sendNFTToSpending(props);
        },
        {
            onSettled() {
                queryClient.invalidateQueries([QueryKey.Transfer, 'token']);
            },
        }
    );
    return { mutate, isLoading, data };
};

export const useSendTransferTokenTransaction = () => {
    const queryClient = useQueryClient();

    const { mutate, isLoading, data } = useMutation(
        async (props: TokenTransferProps) => {
            return await WalletSingleTon.getInstance().sendToken(props);
        },
        {
            onSettled() {
                queryClient.invalidateQueries([QueryKey.Transfer, 'token']);
            },
        }
    );
    return { mutate, isLoading, data };
};

export const useSendTransferTokenToSpending = () => {
    const queryClient = useQueryClient();

    const { mutate, isLoading, data } = useMutation(
        async (props: TokenTransferToSpendingProps) => {
            return await WalletSingleTon.getInstance().sendTokenToSpending(props);
        },
        {
            onSettled() {
                queryClient.invalidateQueries([QueryKey.Transfer, 'token']);
            },
        }
    );
    return { mutate, isLoading, data };
};

export const useGetWithdrawHistories = (page: number, take: number, withdrawStatus?: string) => {
    const {
        data = { content: {} },
        isLoading,
        refetch,
    } = useQuery([QueryKey.Histories, withdrawStatus], async () => {
        return core.withdraw.getWithdrawHistory(page, take, withdrawStatus);
    });
    const { content: histories } = data;

    return { histories, isLoading, refetch };
};
