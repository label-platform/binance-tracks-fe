import { ItemType } from '@models/item/item.interface';
import { QUALITY_GUARD } from '../common.interface';

export interface MysteryBoxType {
    quality: QUALITY_GUARD;
    openingTimeCountdown: string;
    item: ItemType;
}
