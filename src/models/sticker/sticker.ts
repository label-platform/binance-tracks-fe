import { ATTRIBUTE_GUARD } from '@models/common.interface';
import { Item } from '@models/item/item';
import { StickerType } from './sticker.interface';

const plustAttribute = {
    1: 2,
    2: 8,
    3: 25,
    4: 72,
    5: 200,
    6: 400,
};

const effectPercent = {
    1: 5,
    2: 70,
    3: 220,
    4: 600,
    5: 1400,
    6: 4300,
};

export class Sticker extends Item {
    private readonly sticker: StickerType;
    constructor(props: StickerType) {
        super(props.item);
        this.sticker = props;
    }

    get level() {
        return this.sticker.level;
    }

    get attribute() {
        return this.sticker.attribute.toLocaleLowerCase() as ATTRIBUTE_GUARD;
    }

    get plusStat() {
        return plustAttribute[this.sticker.level];
    }

    get effect() {
        return effectPercent[this.sticker.level];
    }

    static createMock(item: Item, attribute: ATTRIBUTE_GUARD, level = 1) {
        const sticker: StickerType = {
            item: item.selfInfo,
            attribute,
            level,
        };
        return sticker;
    }
}

export const createSticker = (sticker: StickerType): Sticker | Record<string, any> => {
    return sticker?.item ? new Sticker(sticker) : {};
};
