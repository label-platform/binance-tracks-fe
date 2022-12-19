import { Item } from '@models/item/item';
import { convertTimeFormat } from '@utils/string';
import { checkIsDateFinished } from '@utils/timeCalculator';
import moment from 'moment-timezone';
import { MysteryBoxType } from './mystery-box.interface';

export class MysteryBox extends Item {
    private readonly _mysterybox: MysteryBoxType;

    constructor(props: MysteryBoxType) {
        super(props.item);
        this._mysterybox = props;
    }

    get remainLeftTimeToOpen() {
        const millisecond = moment(this._mysterybox.openingTimeCountdown).diff(moment.tz('Europe/London'));
        return convertTimeFormat(millisecond, 'HH[h] MM[m]');
    }

    get isCanBeOpened() {
        return checkIsDateFinished(this._mysterybox.openingTimeCountdown);
    }

    get quality() {
        return this._mysterybox.quality;
    }
}

export function createMysteryBox(mysteryBox: MysteryBoxType): MysteryBox | Record<string, any> {
    return mysteryBox?.item ? new MysteryBox(mysteryBox) : {};
}
