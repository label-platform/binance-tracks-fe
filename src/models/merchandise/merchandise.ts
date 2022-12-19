import { Item } from '@models/item/item';
import { MerchandiseType } from './merchandise.interface';

export class Merchandise extends Item {
    private readonly merchandise: MerchandiseType;
    constructor(props: MerchandiseType) {
        super(props.item);
        this.merchandise = props;
    }

    get description() {
        return this.merchandise.description;
    }

    static createMock(item: Item, description: string) {
        const merchandise: MerchandiseType = {
            item: item.selfInfo,
            description,
        };
        return merchandise;
    }
}

export const createMerchandise = (merchandise: MerchandiseType): Merchandise | Record<string, any> => {
    return merchandise?.item ? new Merchandise(merchandise) : {};
};
