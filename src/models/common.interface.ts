export const QUALITY = {
    DAMAGED: 'damaged',
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary',
} as const;

export const ATTRIBUTE = {
    LUCK: 'luck',
    EFFICIENCY: 'efficiency',
    COMFORT: 'comfort',
    RESILIENCE: 'resilience',
} as const;

export const ITEM_STATUS = {
    COOLDOWN: 'COOLDOWN',
    IDLE: 'IDLE',
    INSERTED: 'INSERTED',
    NOT_INSERTED: 'NOT_INSERTED',
    LISTENING: 'LISTENING',
    SELLING: 'SELLING',
    LEVELING: 'LEVELING',
    NOT_OPENED: 'NOT_OPENED',
    OPENED: 'OPENED',
    BURNED: 'BURNED',
} as const;

export const ITEM_TYPE = {
    PINBALLHEAD: 'PINBALLHEAD',
    HEADPHONE: 'HEADPHONE',
    HEADPHONEBOX: 'HEADPHONEBOX',
    STICKER: 'STICKER',
    MYSTERYBOX: 'MYSTERYBOX',
} as const;

const CURRENCY = {
    LBL: 'LBL',
    BLB: 'BLB',
    BNB: 'BNB',
    BUSD: 'BUSD',
} as const;

export type ValueOf<T extends { [key in string]: string }> = T[keyof T];

export type ATTRIBUTE_GUARD = ValueOf<typeof ATTRIBUTE>;

export type QUALITY_GUARD = ValueOf<typeof QUALITY>;

export type ITEM_STATUS_GUARD = ValueOf<typeof ITEM_STATUS>;

export type ITEM_TYPE_GUARD = ValueOf<typeof ITEM_TYPE>;

export type CURRENCY_GUARD = ValueOf<typeof CURRENCY>;

export interface Cost {
    amount: string;
    currency: CURRENCY_GUARD;
}

export interface PlayedTime {
    totalMins: number;
    days: string;
    hours: string;
    mins: string;
    secs: string;
}
