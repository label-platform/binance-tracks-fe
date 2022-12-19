import { DRAWER_ID } from '@constants/common';
import { AttributeFilter } from './attribute-filter';
import { DrawerFilter } from './drawer-filter';
import { MerchandiseTab } from './merchandise-tab';

export function Merchandise() {
    return (
        <>
            <DrawerFilter drawerId={DRAWER_ID.MARKETPLACE_MERCHANDISE}>
                <AttributeFilter />
                <DrawerFilter.Slider title="level" max={9} />
            </DrawerFilter>
            <MerchandiseTab />
        </>
    );
}
