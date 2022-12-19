import { CURRENCY_GUARD } from '../common.interface';

export type UserType = {
    id: string;
    email: string;
    username: string;
    spendingBalances: Array<{
        tokenSymbol: CURRENCY_GUARD;
        balance: number;
        availableBalance: number;
    }>;
    activationCodes: any[];
    activationCodeId: number | null;
    walletAddress: string | null;
    role: string;
    energyCap: number;
    remainedTokenEarningLimit: number;
    dailyTokenEarningLimit: number;
    isTwoFactorAuthenticationEnabled: boolean;
    isTwoFactorAuthenticationRegistered: boolean;
    countEnergy: number;
    availableEnergy: number;
};
