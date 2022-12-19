import { ItemType } from '@models/item/item.interface';
import { StickerType } from '@models/sticker/sticker.interface';
import { ATTRIBUTE_GUARD, QUALITY_GUARD } from '../common.interface';

export const DOCK_STATUS = {
    LOCK: 'LOCKED', // FE에만 있는 상태 level 도달 못해서 열지 못할 때임..
    NOT_OPENED: 'NOT_OPENED',
    OPENED: 'OPENED',
    INSERTED: 'INSERTED',
} as const;

export type DOCK_STATUS_GUARD = typeof DOCK_STATUS[keyof typeof DOCK_STATUS];

export interface DockType {
    attribute: ATTRIBUTE_GUARD;
    dockStatus: DOCK_STATUS_GUARD;
    quality: QUALITY_GUARD;
    position: number;
    sticker?: ItemType & {
        stickerDetail: StickerType;
    };
    headphoneLevel: number;
}
