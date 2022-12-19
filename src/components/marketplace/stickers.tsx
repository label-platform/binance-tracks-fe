import { StickerTab } from './sticker-tab';
import { DRAWER_ID, FILTER_ID } from '@constants/common';
import { DrawerFilter } from './drawer-filter';
import { AttributeFilter } from './attribute-filter';

export function Stickers() {
    return (
        <>
            <DrawerFilter drawerId={DRAWER_ID.MARKETPLACE_STICKER} filterId={FILTER_ID.STICKER_FILTER}>
                <AttributeFilter />
                <DrawerFilter.Slider title="level" max={9} />
            </DrawerFilter>
            <StickerTab />
        </>
    );
}
