import { DRAWER_ID, FILTER_ID } from '@constants/common';
import { useFilterState, useMarketPlacefilterDispatch } from 'src/recoil/filter';
import { DrawerFilter } from './drawer-filter';
import { QualityFilter } from './quality-filter';
import { TicketTab } from './ticket-tab';

export function Tickets() {
    const filterDispatch = useMarketPlacefilterDispatch();
    const filterState = useFilterState(FILTER_ID.HEADPHONE_FILTER);
    const handleResetFilterOption = () => {
        filterDispatch.clear(FILTER_ID.HEADPHONE_FILTER);
    };

    return (
        <>
            <DrawerFilter drawerId={DRAWER_ID.MARKETPLACE_HEADPHONE} filterId={FILTER_ID.HEADPHONE_FILTER}>
                <DrawerFilter.Single
                    title="type"
                    options={['HEADPHONE', 'HEADPHONEBOX']}
                    doBeforeClick={handleResetFilterOption}
                />
                {filterState?.type && <QualityFilter />}
                {filterState?.type === 'HEADPHONE' ? (
                    <>
                        <DrawerFilter.Slider title="level" max={30} />
                    </>
                ) : null}
            </DrawerFilter>
            <TicketTab />
        </>
    );
}
