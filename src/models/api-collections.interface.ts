import { QUALITY_GUARD } from './common.interface';

type OrderGuard = 'DESC' | 'ASC';

export interface AuthParams {
    email: string;
    password: string;
    otp: string;
}

export interface InventoryListParams {
    userId?: string;
    order?: OrderGuard;
    page?: number;
    take?: number;
}
export interface MarketPlaceListParmas {
    order?: OrderGuard;
    page?: number;
    take?: number;
    mintLessThen?: number;
    mintMoreThen?: number;
    levelLessThen?: number;
    levelMoreThen?: number;
    type?: 'HEADPHONE' | 'HEADPHONEBOX';
    quality?: QUALITY_GUARD;
}
