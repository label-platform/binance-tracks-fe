import { Dock } from '@models/dock/dock';
import { DockType } from '@models/dock/dock.interface';
import { QUALITY_GUARD } from '../common.interface';
import { ItemType } from '../item/item.interface';

export interface HeadphoneType {
    level: number;
    battery: number;
    quality: QUALITY_GUARD;
    efficiency: number;
    luck: number;
    comfort: number;
    resilience: number;
    baseEfficiency: number;
    baseLuck: number;
    baseComfort: number;
    baseResilience: number;
    itemEfficiency: number;
    itemLuck: number;
    itemComfort: number;
    itemResilience: number;
    levelEfficiency: number;
    levelLuck: number;
    levelComfort: number;
    levelResilience: number;
    headphoneDocks: Array<DockType>;
    mintCount?: number;
    availableMintCount?: number;
    parentId1: number | null;
    parentId2: number | null;
    remainedStat: number;
    levelUpCompletionTime: Date | null;
    cooldownTime: Date | null;
    item: ItemType;
}

export interface HeadphoneBox {
    id: string;
    quality: QUALITY_GUARD;
    sources: Array<string>;
}
