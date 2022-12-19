import { CURRENCY_GUARD } from '@models/common.interface';
import { UserType } from './user.interface';
export class User {
    public readonly _user: UserType;

    constructor(userInfo: UserType) {
        this._user = userInfo;
    }

    get id() {
        return this._user.id;
    }

    get name() {
        return this._user.username;
    }

    get availableEnergy() {
        return this._user.availableEnergy;
    }

    get walletAddress() {
        return this._user.walletAddress;
    }

    get email() {
        return this._user.email;
    }

    get hasWalletAddress() {
        return !!this._user.walletAddress;
    }

    get hasActivationCodeId() {
        return this._user.activationCodeId !== null;
    }

    get dailyTokenEarningLimit() {
        return this._user.dailyTokenEarningLimit;
    }

    get remainedTokenEarningLimit() {
        return this._user.remainedTokenEarningLimit;
    }

    get activationCodesLength() {
        return this._user.activationCodes.length;
    }

    get spendingBalances(): Record<CURRENCY_GUARD, number> {
        return this._user.spendingBalances.reduce((previous, balance) => {
            return {
                ...previous,
                [balance.tokenSymbol]: balance.availableBalance,
            };
        }, {}) as Record<CURRENCY_GUARD, number>;
    }

    get availableEnergyPercent() {
        return Math.ceil((this.availableEnergy / this._user.energyCap) * 100);
    }

    get remainTokenEarningPercent() {
        return Math.ceil((this.remainedTokenEarningLimit / this.dailyTokenEarningLimit) * 100);
    }

    get isOTPEnabled() {
        return this._user.isTwoFactorAuthenticationEnabled;
    }

    get isOTPRegistered() {
        return this._user.isTwoFactorAuthenticationRegistered;
    }
}

export function createUser(user: UserType): User | Record<string, any> {
    return user?.id ? new User(user) : {};
}
