import { QUALITY_GUARD } from '@models/common.interface';
import { ItemType } from '@models/item/item.interface';

export interface HeadphonBoxType {
    item: ItemType;
    parentId1: number | null;
    parentId2: number | null;
    quality: QUALITY_GUARD;
}
