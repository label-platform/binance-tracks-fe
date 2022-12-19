import {
    ActivationCodes,
    Auth,
    EarningSystem,
    InventoryHeadphone,
    InventoryHeadphoneBox,
    InventoryMysteryBox,
    SpendingBalance,
    InventoryPinballHead,
    InventorySticker,
    MarketPlace,
    User,
    Withdraw,
    Playlist,
    PlaylistCategory,
} from './api-collections';

export const core = (() => {
    const activationcode = new ActivationCodes();
    const auth = new Auth();
    const earning = new EarningSystem();
    const headphone = new InventoryHeadphone();
    const headphoneBox = new InventoryHeadphoneBox();
    const sticker = new InventorySticker();
    const mysteryBox = new InventoryMysteryBox();
    const pinballHead = new InventoryPinballHead();
    const spendingBalance = new SpendingBalance();
    const marketPlace = new MarketPlace();
    const user = new User();
    const withdraw = new Withdraw();
    const playlist = new Playlist();
    const playlistcategory = new PlaylistCategory();

    return {
        activationcode,
        auth,
        earning,
        marketPlace,
        user,
        withdraw,
        spendingBalance,
        inventory: {
            headphone,
            headphoneBox,
            sticker,
            mysteryBox,
            pinballHead,
        },
        playlist,
        playlistcategory,
    };
})();
