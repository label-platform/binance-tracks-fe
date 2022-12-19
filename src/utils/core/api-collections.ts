import { AuthParams, InventoryListParams, MarketPlaceListParmas } from '@models/api-collections.interface';
import { ATTRIBUTE_GUARD } from '@models/common.interface';
import { ContractGuard } from '@services/wallet/wallet';
import { serverProxy } from './server-proxy';

class BaseApiCollection {
    protected apiName: string;
    constructor(apiName: string) {
        this.apiName = apiName;
    }
}

type ListApiResponse = {
    content: {
        data: any;
        meta: any;
    };
    success: boolean;
};

export class ActivationCodes extends BaseApiCollection {
    constructor() {
        super('activation-codes');
    }

    async verifyActivationCode(email: string, activationCode: string) {
        const response = await serverProxy.put(`${this.apiName}/update-activation-code`, {
            email,
            activationCode,
        });
        return response.data;
    }

    async getList(): Promise<ListApiResponse> {
        const response = await serverProxy.get(`${this.apiName}/user-activation-code-list`);
        return response.data;
    }
}

export class Auth extends BaseApiCollection {
    constructor() {
        super('auth');
    }

    async sendVcode(email: string) {
        const response = await serverProxy.post(`${this.apiName}/send-otp`, { email });
        return response.data;
    }

    async loginByPassword(authInfo: Omit<AuthParams, 'otp'>) {
        const response = await serverProxy.post(`${this.apiName}/login-by-password`, { ...authInfo });
        return response.data;
    }

    async loginByVcode(authInfo: Omit<AuthParams, 'password'>) {
        const response = await serverProxy.post(`${this.apiName}/login-by-otp/confirm-otp`, { ...authInfo });
        return response.data;
    }

    async createOTPQR() {
        const { request } = await serverProxy.post(
            `${this.apiName}/2fa/otp-generate`,
            {},
            {
                responseType: 'arraybuffer',
            }
        );

        return request.response;
    }

    async confirmOTPBeforeRegister(code: string) {
        const response = await serverProxy.post(`${this.apiName}/2fa/otp-register-confirm`, { code });
        return response.data;
    }

    async confirmOTP(code: string) {
        const response = await serverProxy.post(`${this.apiName}/2fa/otp-confirm`, { code });
        return response.data;
    }

    async setOtpEnable() {
        const response = await serverProxy.put(`${this.apiName}/2fa/otp-enable`);
        return response.data;
    }

    async setOtpDisable() {
        const response = await serverProxy.put(`${this.apiName}/2fa/otp-disable`);
        return response.data;
    }

    async confirmVerificationCode(email: string, otp: string) {
        const response = await serverProxy.post(`${this.apiName}/2fa/confirm-email-otp`, { email, otp });
        return response.data;
    }

    async refreshToken(token: string) {
        const response = await serverProxy.post(`${this.apiName}/refresh-token`, { refreshToken: token });
        return response;
    }

    async logout() {
        const response = await serverProxy.post(`${this.apiName}/logout`);
        return response.data;
    }

    async updatePassword(email: string, password: string, vcode: string) {
        const response = await serverProxy.put(`${this.apiName}/update-password`, {
            email,
            password,
            otp: vcode,
        });
        return response.data;
    }
}

export class EarningSystem extends BaseApiCollection {
    constructor() {
        super('earning-system');
    }
}

export class InventoryHeadphone extends BaseApiCollection {
    constructor() {
        super('inventories/headphones');
    }

    async getList({ order = 'DESC', page = 1, take = 10, userId }: InventoryListParams): Promise<ListApiResponse> {
        const response = await serverProxy.get(`${this.apiName}/list`, {
            params: {
                userId,
                take,
                order,
                page,
            },
        });
        return response.data;
    }

    async getSingle(itemId: string) {
        const response = await serverProxy.get(`${this.apiName}/detail`, {
            params: {
                itemId,
            },
        });

        return response.data;
    }

    async getListeningHeadphone() {
        const response = await serverProxy.get(`${this.apiName}/listening`);

        return response.data;
    }

    async update(data: any) {
        const response = await serverProxy.put(`${this.apiName}`, { ...data });
        return response.data;
    }

    async getCalculateLevelUp(headphoneId: string) {
        const response = await serverProxy.get(`${this.apiName}/level-up`, {
            params: {
                headphoneId,
            },
        });

        return response.data;
    }

    async requestLevelUp(headphoneId: string) {
        const response = await serverProxy.put(`${this.apiName}/level-up`, { headphoneId });
        return response.data;
    }

    async confirmLevelUp(headphoneId: string) {
        const response = await serverProxy.put(`${this.apiName}/level-up/complete`, { headphoneId });
        return response.data;
    }

    async releaseCoolDown(headphoneId: string) {
        const response = await serverProxy.put(`${this.apiName}/cooldown/complete`, { headphoneId });
        return response.data;
    }

    async getCalculateLevelUpBoost(headphoneId: string) {
        const response = await serverProxy.get(`${this.apiName}/level-up/boost`, {
            params: {
                headphoneId,
            },
        });

        return response.data;
    }

    async boostLevelUp(headphoneId: string) {
        const response = await serverProxy.put(`${this.apiName}/level-up/boost`, { headphoneId });
        return response.data;
    }

    async getCalculatedOpenHeadphoneDock(headphoneId: string, dockPosition: number) {
        const response = await serverProxy.get(`${this.apiName}/dock`, {
            params: {
                headphoneId,
                dockPosition,
            },
        });
        return response.data;
    }
    async putOpenHeadphoneDock(headphoneId: string, position: number) {
        await serverProxy.put(`${this.apiName}/dock/open`, { headphoneId, position });
        return;
    }

    async getCalculateMint(headphoneId1: string, headphoneId2: string) {
        const response = await serverProxy.get(`${this.apiName}/mint`, {
            params: {
                headphoneId1,
                headphoneId2,
            },
        });

        return response.data;
    }

    async mint(headphoneIds: string[]) {
        const response = await serverProxy.post(`${this.apiName}/Mint`, { headphoneIds });
        return response.data;
    }

    async getCalculateChargeBettery(headphoneId: string) {
        const response = await serverProxy.get(`${this.apiName}/charge`, {
            params: {
                headphoneId,
            },
        });
        return response.data;
    }

    async charge(headphoneId: string, chargingAmount: number) {
        await serverProxy.put(`${this.apiName}/charge`, {
            headphoneId,
            chargingAmount,
        });
        return;
    }

    async mount(headphoneId: string) {
        const response = await serverProxy.put(`${this.apiName}/mount`, { headphoneId });
        return response.data;
    }

    async statUp(headphoneId: string, point: Record<ATTRIBUTE_GUARD, number>) {
        const response = await serverProxy.put(`${this.apiName}/level-up/stat-up`, { headphoneId, ...point });
        return response.data;
    }
}
export class InventoryHeadphoneBox extends BaseApiCollection {
    constructor() {
        super('inventories/headphone-boxes');
    }

    async getList({ order = 'DESC', page = 1, take = 10, userId }: InventoryListParams): Promise<ListApiResponse> {
        const response = await serverProxy.get(`${this.apiName}/list`, {
            params: {
                userId,
                take,
                order,
                page,
            },
        });
        return response.data;
    }

    async getSingle(itemId: string) {
        const response = await serverProxy.get(`${this.apiName}/detail`, {
            params: {
                itemId,
            },
        });

        return response.data;
    }
    async openHeadphoneBox(headphoneBoxId: string) {
        const response = await serverProxy.post(`${this.apiName}/open`, { headphoneBoxId });
        return response.data;
    }
}
export class InventorySticker extends BaseApiCollection {
    constructor() {
        super('inventories/stickers');
    }

    async getList({ order = 'DESC', page = 1, take = 10 }: InventoryListParams): Promise<ListApiResponse> {
        const response = await serverProxy.get(`${this.apiName}/list`, {
            params: {
                take,
                order,
                page,
            },
        });
        return response.data;
    }

    async getListByAttribute({
        order = 'DESC',
        page = 1,
        take = 10,
        attribute,
    }: InventoryListParams & { attribute: Uppercase<ATTRIBUTE_GUARD> }): Promise<ListApiResponse> {
        const response = await serverProxy.get(`${this.apiName}/list/insert`, {
            params: {
                order,
                page,
                take,
                attribute,
            },
        });

        return response.data;
    }

    async getSingle(itemId: string) {
        const response = await serverProxy.get(`${this.apiName}/detail`, {
            params: {
                itemId,
            },
        });

        return response.data;
    }

    async insert(headphoneId: string, dockPosition: number, stickerId: string) {
        const response = await serverProxy.put(`${this.apiName}/insert`, {
            headphoneId,
            headphoneDockPosition: dockPosition,
            stickerId,
        });

        return response.data;
    }

    async remove(headphoneId: string, dockPosition: number, stickerId: string) {
        const response = await serverProxy.put(`${this.apiName}/remove`, {
            headphoneId,
            headphoneDockPosition: dockPosition,
            stickerId,
        });

        return response.data;
    }
}
export class InventoryMysteryBox extends BaseApiCollection {
    constructor() {
        super('inventories/mystery-boxes');
    }

    async getList({ order = 'DESC', page = 1, take = 4 }: InventoryListParams): Promise<ListApiResponse> {
        const response = await serverProxy.get(`${this.apiName}/list`, {
            params: {
                take,
                order,
                page,
            },
        });

        return response.data;
    }

    async getSingle(itemId: string) {
        const response = await serverProxy.get(`${this.apiName}/detail`, {
            params: {
                itemId,
            },
        });

        return response.data;
    }

    async calculateOpen(itemId: string) {
        const response = await serverProxy.get(`${this.apiName}/open`, {
            params: {
                itemId,
            },
        });

        return response.data;
    }

    async calculateBoost(itemId: string) {
        const response = await serverProxy.get(`${this.apiName}/open/boost`, {
            params: {
                itemId,
            },
        });

        return response.data;
    }

    async open(itemId: string) {
        const response = await serverProxy.post(`${this.apiName}/open`, {
            mysteryBoxId: itemId,
        });

        return response.data;
    }

    async openBoost(itemId: string) {
        const response = await serverProxy.post(`${this.apiName}/open/boost`, {
            mysteryBoxId: itemId,
        });

        return response.data;
    }
}
export class InventoryPinballHead extends BaseApiCollection {
    constructor() {
        super('inventories/pinballheads');
    }

    async getList({ order = 'DESC', page = 1, take = 10, userId }: InventoryListParams): Promise<ListApiResponse> {
        const response = await serverProxy.get(`${this.apiName}/list`, {
            params: {
                userId,
                take,
                order,
                page,
            },
        });
        return response.data;
    }

    async getSingle(itemId: string) {
        const response = await serverProxy.get(`${this.apiName}/detail`, {
            params: {
                itemId,
            },
        });

        return response.data;
    }
}

export class SpendingBalance extends BaseApiCollection {
    constructor() {
        super('spending-balances');
    }

    async getBalancesByJWT() {
        const response = await serverProxy.get(`${this.apiName}`);

        return response.data;
    }
}

export class MarketPlace extends BaseApiCollection {
    constructor() {
        super('marketplace');
    }
    async sell(itemId: string, price: number) {
        const response = await serverProxy.post(`${this.apiName}/sell`, {
            itemId,
            price,
        });
        return response.data;
    }

    async buy(itemId: string) {
        const response = await serverProxy.post(`${this.apiName}/buy/${itemId}`);
        return response.data;
    }

    async updateSell(sellId: string, price: number) {
        const response = await serverProxy.post(`${this.apiName}/updateSell/${sellId}`, {
            price,
        });
        return response.data;
    }
    async cancelSell(sellId: string) {
        const response = await serverProxy.post(`${this.apiName}/cancelSell/${sellId}`);
        return response.data;
    }

    async getHeadphoneList({
        order = 'DESC',
        page = 1,
        take = 10,
        type = 'HEADPHONE',
        ...rest
    }: MarketPlaceListParmas) {
        const response = await serverProxy.get(`${this.apiName}/list/headphones-or-headphone-boxes`, {
            params: {
                order,
                page,
                take,
                type,
                ...rest,
            },
        });
        return response.data;
    }

    async getStickerList({
        order = 'DESC',
        page = 1,
        take = 10,
        ...rest
    }: Omit<MarketPlaceListParmas, 'type' | 'mintLessThen' | 'mintMoreThen'>) {
        const response = await serverProxy.get(`${this.apiName}/list/stickers`, {
            params: {
                order,
                page,
                take,
                ...rest,
            },
        });
        return response.data;
    }

    async getMerchandiseList({
        order = 'DESC',
        page = 1,
        take = 10,
        ...rest
    }: Omit<MarketPlaceListParmas, 'type' | 'mintLessThen' | 'mintMoreThen'>) {
        const response = await serverProxy.get(`${this.apiName}/list/merchandise`, {
            params: {
                order,
                page,
                take,
                ...rest,
            },
        });
        return response.data;
    }

    async getTicketList({
        order = 'DESC',
        page = 1,
        take = 10,
        ...rest
    }: Omit<MarketPlaceListParmas, 'type' | 'mintLessThen' | 'mintMoreThen'>) {
        const response = await serverProxy.get(`${this.apiName}/list/tickets`, {
            params: {
                order,
                page,
                take,
                ...rest,
            },
        });
        return response.data;
    }
}

export class User extends BaseApiCollection {
    constructor() {
        super('users');
    }

    async getSingle(userId: string) {
        const response = await serverProxy.get(`${this.apiName}/${userId}`);
        return response.data;
    }

    async getSelf() {
        const response = await serverProxy.get(`${this.apiName}/detail`);
        return response.data;
    }

    async registWalletAddress(address: string) {
        const response = await serverProxy.put(`${this.apiName}/wallet-address`, { walletAddress: address });
        return response.data;
    }

    async updateUserName(name: string) {
        const response = await serverProxy.put(`${this.apiName}`, { username: name });
        return response.data;
    }
}

export class Withdraw extends BaseApiCollection {
    constructor() {
        super('withdraws');
    }
    async sendToken(tokenSymbol: string, amount: string, signedMessage: string) {
        const response = await serverProxy.post(`${this.apiName}/token`, {
            tokenSymbol,
            amount,
            signedMessage,
        });
        return response.data;
    }

    async sendNFT(itemType: ContractGuard, itemId: string, signedMessage: string) {
        const response = await serverProxy.post(`${this.apiName}/nft`, {
            itemType,
            itemId,
            signedMessage,
        });
        return response.data;
    }

    async getWithdrawHistory(page: number, take: number, withdrawStatus?: string) {
        const response = await serverProxy.get(`histories/${this.apiName}-deposits`, {
            params: {
                page,
                take,
                withdrawStatus,
            },
        });
        return response.data;
    }
}

export class Playlist extends BaseApiCollection {
    constructor() {
        super('playlist-manager');
    }

    async getList(): Promise<ListApiResponse> {
        const response = await serverProxy.get(`${this.apiName}/playlist`);
        return response.data;
    }

    async getSingle(playlistID: number) {
        const response = await serverProxy.get(`${this.apiName}/playlist/${playlistID}`);
        return response.data;
    }
}

export class PlaylistCategory extends BaseApiCollection {
    constructor() {
        super('playlist-categories');
    }

    async getCategoryList(): Promise<ListApiResponse> {
        const response = await serverProxy.get(`${this.apiName}/all`);
        return response.data;
    }

    async getSingleCategoryList(playlistID: number) {
        const response = await serverProxy.get(`${this.apiName}/${playlistID}`);
        return response.data;
    }
}
