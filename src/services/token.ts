import { HTTP_STATUS } from '@constants/common';
import { NATIVE_EVENT } from '@constants/native-event';
import { core } from '@utils/core/core';
import { doEither, sendToNative } from '@utils/native';

export class TokenManagerSingleTon {
    private static instance: any;
    private _accessToken = '';
    private _refreshToken = '';
    private _isFetching = false;

    constructor() {
        this.refresh.bind(this);
        this.setAccessToken.bind(this);
        this.setRefreshToken.bind(this);
    }

    public static getInstance(): TokenManagerSingleTon {
        return this.instance || (this.instance = new this());
    }

    get accessToken(): string {
        return this._accessToken;
    }

    get refreshToken() {
        return this._refreshToken;
    }

    get isFetching() {
        return this._isFetching;
    }

    init(accessToken: string, refreshToken: string) {
        this._accessToken = accessToken;
        this._refreshToken = refreshToken;
        localStorage.setItem('rft', refreshToken);
    }

    load() {
        try {
            doEither(
                () => {
                    this._refreshToken = localStorage.getItem('rft');
                },
                () => {
                    this._refreshToken = typeof window === 'undefined' ? '' : (window as any).refreshToken;
                    (window as any).refreshToken = undefined;
                }
            );
        } catch (error) {
            console.log(error);
        }
    }

    clear() {
        localStorage.removeItem('rft');
        this._accessToken = '';
        this._refreshToken = '';
    }

    async refresh() {
        if (this._isFetching) return;
        this._isFetching = true;
        try {
            const { data } = await core.auth.refreshToken(this._refreshToken);
            this._accessToken = data.content.accessToken;
            sendToNative({ name: NATIVE_EVENT.SEND_ACCESS_TOKEN, params: { token: this._accessToken } });
            this._isFetching = false;
        } catch (error: any) {
            this._isFetching = false;
            this.clear();
        }
    }

    setAccessToken(token: string) {
        this._accessToken = token;
    }

    setRefreshToken(token: string) {
        this._refreshToken = token;
    }

    get isCanBeRefresh() {
        return !!this._refreshToken;
    }

    get isCanDoRefresh() {
        return this.isCanBeRefresh && !this._isFetching;
    }
}
