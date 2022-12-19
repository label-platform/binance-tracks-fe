import { ValueOf } from '@models/common.interface';

export const NATIVE_EVENT = {
    LOGIN: 'login',
    LOGOUT: 'logout',
    SAVE_PRIVATE_KEY: 'savePrivateKey',
    SAVE_PASSCODE: 'savePasscode',
    CHECK_PASSCODE: 'checkPasscode',
    EXPIRED_TOKEN: 'expiredToken',
    SET_LISTENING_HEADPHONE: 'listeningHeadphone',
    CHARGE_HEADPHONE: 'chargeHeadphone',
    COVER_DISPLAY: 'coverNativeDisplay',
    RELEASE_DISPLAY: 'releaseNativeDisplay',
    BACK: 'backPress',
    GO_TO_PLAY: 'goToPlay',
    EXIT_APP: 'exitApp',
    GET_PRIVATE_KEY: 'getPrivateKey',
    SET_NO_BOTTOM_MENU: 'setNoBottomMenu',
    SHOW_ALERT: 'showAlert',
    SHOW_LOG: 'showLog',
    SEND_ACCESS_TOKEN: 'sendAccessToken',
    CHECK_MINI_PLAYER: 'checkMiniPlayer',
    BACK_TO_PLAYER: 'backToPlayer',
    SEND_SONG_PLAY: 'sendSongPlay',
    REQUEST_CURRENT_SONG_INFO: 'requesCurrentSongInfo',
    REQUEST_NAVIGATION_TO_STACK: 'requsetNavigation',
    READ_CLIPBOARD: 'readClipboard',
    WRITE_CLIPBOARD: 'writeClipboard',
} as const;

export const LISTEN_EVENT = {
    MANAGE_HEADPHONE: 'manageHeadphone',
    BACK: 'backPress',
    CHECK_MINI_PLAYER: 'checkMiniPlayer',
    CHECK_PASSCODE: 'isCorrectPassCode',
    SEND_PRIVATE_KEY: 'sendPrivateKey',
    SEND_INFO_CURRENT_SONG: 'sendInfoCurrentSong',
    SET_UP_WALLET: 'setupWallet',
    READ_CLIPBOARD: 'readClipboard',
} as const;

export const NATIVE_STACK = {
    HOME: 'HomeScreen',
    INVENTORY: 'Inventory',
    MARKET: 'MarketScreen',
    PLAYLIST: 'PlayListScreen',
};

export type NATIVE_EVENT_GUARD = ValueOf<typeof NATIVE_EVENT>;
export type LISTEN_EVENT_GUARD = ValueOf<typeof LISTEN_EVENT>;
type MessageParam = {
    data: {
        type: LISTEN_EVENT_GUARD;
        params: any;
    };
};
export type ListenCallbackType = (event: MessageParam) => void;
