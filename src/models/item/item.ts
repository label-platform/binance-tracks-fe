import { ITEM_STATUS, ITEM_STATUS_GUARD, ITEM_TYPE_GUARD } from '@models/common.interface';
import moment from 'moment';
import { ItemType } from './item.interface';

export class Item {
    protected readonly item: ItemType;
    constructor(props: ItemType) {
        this.item = props;
    }

    get id(): string {
        return String(this.item.id);
    }

    get imgUrl() {
        return this.item.imgUrl;
    }

    get status() {
        return this.item.itemStatus;
    }

    get type() {
        return this.item.type;
    }

    get price() {
        if (this.isNotBeSelled()) return 0;
        return this.item.itemSale.price;
    }

    get sellId(): string {
        if (this.isNotBeSelled()) return null;
        return String(this.item.itemSale.id);
    }

    get dateRegisterdSell() {
        if (this.isNotBeSelled()) return null;

        return moment(this.item.itemSale.createAt).format('YYYY-MM-DD');
    }

    get sellCurrency(): string {
        if (this.isNotBeSelled()) return null;
        return String(this.item.itemSale.currency);
    }

    get updateAt(): Date {
        return this.item.updatedAt;
    }

    private isNotBeSelled(): boolean {
        return this.status !== ITEM_STATUS.SELLING && this.item.itemSale === null;
    }

    static createMockItem(type: ITEM_TYPE_GUARD, status: ITEM_STATUS_GUARD) {
        const item: ItemType = {
            id: Math.floor(Math.random() * 1000),
            createAt: new Date(),
            updatedAt: new Date(),
            imgUrl: '-',
            type,
            itemStatus: status,
            itemSale: null,
        };

        if (status === ITEM_STATUS.SELLING) {
            item.itemSale = {
                id: Math.floor(Math.random() * 1000),
                createAt: new Date(),
                updatedAt: new Date(),
                currency: 'BNB',
                price: 100,
            };
        }

        return new this(item);
    }

    get selfInfo() {
        return this.item;
    }
}
