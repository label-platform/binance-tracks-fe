import { QUALITY_GUARD } from '@models/common.interface';
import { Item } from '@models/item/item';
import { HeadphonBoxType } from './headphone-box.interface';

export class HeadphoneBox extends Item {
    private readonly headphoneBox: HeadphonBoxType;

    constructor(props: HeadphonBoxType) {
        super(props.item);
        this.headphoneBox = props;
    }

    get quality() {
        return this.headphoneBox.quality.toLocaleLowerCase() as QUALITY_GUARD;
    }

    get imgUrl() {
        return `/images/headphone-box-${this.quality}.png`;
    }

    get parentId1() {
        return this.headphoneBox.parentId1 !== null ? String(this.headphoneBox.parentId1) : null;
    }

    get parentId2() {
        return this.headphoneBox.parentId2 !== null ? String(this.headphoneBox.parentId2) : null;
    }

    static createMock(item: Item, quality: QUALITY_GUARD) {
        const headphoneBox: HeadphonBoxType = {
            quality,
            item: item.selfInfo,
            parentId1: 1,
            parentId2: 2,
        };
        return headphoneBox;
    }
}

export function createHeadphoneBox(box: HeadphonBoxType): HeadphoneBox | Record<string, any> {
    return box?.item ? new HeadphoneBox(box) : {};
}
