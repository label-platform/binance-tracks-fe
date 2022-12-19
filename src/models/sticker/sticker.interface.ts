import { ItemType } from '@models/item/item.interface';
import { ATTRIBUTE_GUARD } from '../common.interface';

export interface StickerType {
    attribute: ATTRIBUTE_GUARD;
    level: number;
    item: ItemType;
}
