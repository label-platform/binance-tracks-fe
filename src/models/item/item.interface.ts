import { ITEM_STATUS_GUARD, ITEM_TYPE_GUARD } from '../common.interface';

type ItemSale = {
    createAt: Date;
    updatedAt: Date;
    id: number;
    price: number;
    currency: string;
};
export interface ItemType {
    createAt: Date;
    updatedAt: Date;
    id: number;
    imgUrl: string;
    type: ITEM_TYPE_GUARD;
    itemStatus: ITEM_STATUS_GUARD;
    itemSale: ItemSale | null;
}
