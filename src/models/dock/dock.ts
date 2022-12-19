import { ATTRIBUTE_GUARD, QUALITY, QUALITY_GUARD } from '@models/common.interface';
import { createSticker, Sticker } from '@models/sticker/sticker';
import { DockType, DOCK_STATUS, DOCK_STATUS_GUARD } from './dock.interface';

const specialEffect: Record<QUALITY_GUARD, number> = {
    [QUALITY.DAMAGED]: 0,
    [QUALITY.COMMON]: 0,
    [QUALITY.UNCOMMON]: 10,
    [QUALITY.RARE]: 20,
    [QUALITY.EPIC]: 30,
    [QUALITY.LEGENDARY]: 50,
};

export class Dock {
    private _headphoneLevel: number;
    private _sticker: Sticker | Record<string, any>;
    private _position: number;
    private _dockStatus: DOCK_STATUS_GUARD;
    private _quality: QUALITY_GUARD;
    private _attribute: ATTRIBUTE_GUARD;

    constructor(props: DockType) {
        this._position = props.position;
        this._dockStatus = props.dockStatus;
        this._attribute = props.attribute.toLowerCase() as ATTRIBUTE_GUARD;
        this._quality = props.quality.toLowerCase() as QUALITY_GUARD;
        this._headphoneLevel = props.headphoneLevel;

        this._sticker = props.sticker ? createSticker({ ...props.sticker.stickerDetail, item: props.sticker }) : null;
    }

    get attribute() {
        return this._attribute;
    }

    get position() {
        return this._position;
    }

    get status() {
        if (this._position === 1 && this._headphoneLevel < 5) return DOCK_STATUS.LOCK;
        if (this._position === 2 && this._headphoneLevel < 10) return DOCK_STATUS.LOCK;
        if (this._position === 3 && this._headphoneLevel < 15) return DOCK_STATUS.LOCK;
        if (this._position === 4 && this._headphoneLevel < 20) return DOCK_STATUS.LOCK;
        return this._dockStatus;
    }

    get quality() {
        return this._quality;
    }

    get quliatyToNumber() {
        switch (this.quality) {
            case QUALITY.COMMON:
                return 1;
            case QUALITY.UNCOMMON:
                return 2;
            case QUALITY.RARE:
                return 3;
            case QUALITY.EPIC:
                return 4;
            case QUALITY.LEGENDARY:
                return 5;
            default:
                return 1;
        }
    }

    get sticker() {
        return this._sticker;
    }

    get effect() {
        return specialEffect[this.quality];
    }

    get unlockLevel() {
        switch (this.position) {
            case 1: {
                return 5;
            }
            case 2: {
                return 10;
            }
            case 3: {
                return 15;
            }
            case 4: {
                return 20;
            }
            default: {
                return 0;
            }
        }
    }
}

export function createDock(dock: DockType): Dock | Record<string, any> {
    return dock.position ? new Dock(dock) : {};
}
