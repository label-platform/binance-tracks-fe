import { ITEM_STATUS, QUALITY_GUARD } from '@models/common.interface';
import { createDock, Dock } from '@models/dock/dock';
import { DockType } from '@models/dock/dock.interface';
import { Item } from '@models/item/item';
import { convertBatteryToGage } from '@utils/helper';
import { calculateDuration } from '@utils/timeCalculator';
import { Duration } from 'moment';
import { HeadphoneType } from './headphone.interface';

function createRandomHeadphoneImage(id) {
    const headphoneImages = [
        'headphone_common.png',
        'headphone_common2.png',
        'headphone_epic.png',
        'headphone_legendary.png',
        'headphone_uncommon.png',
        'headphone_rare.png',
    ];
    const index = +id % headphoneImages.length;
    return `/images/headphones/${headphoneImages[index]}`;
}

export class Headphone extends Item {
    private readonly headphone: HeadphoneType;
    private readonly _docks: Array<Dock>;
    constructor(headphone: HeadphoneType) {
        super(headphone.item);

        this.headphone = headphone;

        this._docks = (headphone?.headphoneDocks || []).map<Dock>(
            (dock: DockType) => createDock({ ...dock, headphoneLevel: this.headphone.level }) as Dock
        );
    }

    get level() {
        return this.headphone.level;
    }

    get imgUrl() {
        /* TODO:: 추후에 item url로 변경 */
        return createRandomHeadphoneImage(this.id);
    }

    get docks() {
        return this._docks;
    }

    get remainDurationForLevelup(): Duration | null {
        if (this.status !== ITEM_STATUS.LEVELING) return null;
        return calculateDuration(this.headphone.levelUpCompletionTime);
    }

    get isLevelupFinished(): boolean {
        if (this.status !== ITEM_STATUS.LEVELING) return false;

        return this.remainDurationForLevelup.asMilliseconds() < 0;
    }

    get remainDurationForCoolDown(): Duration | null {
        if (this.status !== ITEM_STATUS.COOLDOWN) return null;
        return calculateDuration(this.headphone.cooldownTime);
    }

    get isCoolDownFinished(): boolean {
        if (this.status !== ITEM_STATUS.COOLDOWN) return false;

        return this.remainDurationForCoolDown.asMilliseconds() < 0;
    }

    get totalDurationForLevelup(): Duration | null {
        if (this.status !== ITEM_STATUS.LEVELING) return null;
        return calculateDuration(this.headphone.levelUpCompletionTime, this.updateAt);
    }

    get points() {
        return {
            total: {
                efficiency: this.headphone.efficiency,
                luck: this.headphone.luck,
                comfort: this.headphone.comfort,
                resilience: this.headphone.resilience,
            },
            base: {
                efficiency: this.headphone.baseEfficiency,
                luck: this.headphone.baseLuck,
                comfort: this.headphone.baseComfort,
                resilience: this.headphone.baseResilience,
            },
            level: {
                efficiency: this.headphone.levelEfficiency,
                luck: this.headphone.levelLuck,
                comfort: this.headphone.levelComfort,
                resilience: this.headphone.levelResilience,
            },
            item: {
                efficiency: this.headphone.itemEfficiency,
                luck: this.headphone.itemLuck,
                comfort: this.headphone.itemComfort,
                resilience: this.headphone.itemResilience,
            },
            remain: this.headphone.remainedStat,
        };
    }

    get isCanBeMinted(): boolean {
        return this.status === ITEM_STATUS.IDLE && this.level > 4 && this.availableMintCount > 0;
    }

    get isCanBeCharged(): boolean {
        return this.status === ITEM_STATUS.IDLE && this.battery < 100;
    }

    get isCanBeSelled(): boolean {
        return this.status === ITEM_STATUS.IDLE && this.battery === 100 && !this.hasSticker;
    }

    get isCanBeTransfered(): boolean {
        return this.status === ITEM_STATUS.IDLE && this.battery === 100 && !this.hasSticker;
    }

    get isCanBeMounted(): boolean {
        return this.status === ITEM_STATUS.IDLE;
    }

    get hasSticker(): boolean {
        return !!this.docks.filter((dock) => dock.sticker).length;
    }

    get battery() {
        return this.headphone.battery;
    }

    get quality() {
        return this.headphone.quality.toLocaleLowerCase() as QUALITY_GUARD;
    }

    get mintCount() {
        return this.headphone.mintCount;
    }

    get availableMintCount() {
        return this.headphone.availableMintCount;
    }

    get parentId1(): string | null {
        return this.headphone.parentId1 === null ? null : String(this.headphone.parentId1);
    }

    get parentId2(): string | null {
        return this.headphone.parentId2 === null ? null : String(this.headphone.parentId2);
    }

    get batteryGage(): number {
        return convertBatteryToGage(this.battery);
    }

    static createMock(
        item: Item,
        {
            quality,
            battery = 100,
            level = 0,
            levelUpCompletionTime = null,
        }: {
            quality: QUALITY_GUARD;
            battery?: number;
            level?: number;
            levelUpCompletionTime?: Date | null;
        }
    ) {
        const headphone: HeadphoneType = {
            item: item.selfInfo,
            quality,
            efficiency: 3,
            luck: 3,
            comfort: 3,
            resilience: 3,
            baseEfficiency: 1,
            baseLuck: 1,
            baseComfort: 1,
            baseResilience: 1,
            itemEfficiency: 1,
            itemLuck: 1,
            itemComfort: 1,
            itemResilience: 1,
            levelEfficiency: 1,
            levelLuck: 1,
            levelComfort: 1,
            levelResilience: 1,
            mintCount: 1,
            availableMintCount: 6,
            battery,
            level,
            parentId1: 1,
            parentId2: 2,
            remainedStat: 4,
            levelUpCompletionTime,
            cooldownTime: null,
            headphoneDocks: [],
        };
        return headphone;
    }
}

export function createHeadphone(headphone: HeadphoneType): Headphone | Record<string, any> {
    return headphone?.item ? new Headphone(headphone) : {};
}
