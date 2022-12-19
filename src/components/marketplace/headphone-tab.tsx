import { Column, Row, TRDivider } from '@components/common/flex';
import { ItemCard } from '../common/item-card';
import { ModalBuyItem } from './modal-buy-item';
import { FILTER_ID, MAX_MINT, MODAL_ID } from '@constants/common';
import { useModalDispatch } from 'src/recoil/modal';
import { ListContainer } from '@components/common/list-container';
import { useTheme } from '@emotion/react';
import { TRLabel } from '@components/common/labels/label';
import { TRButton } from '@components/common/buttons/button';
import { ItemThumbnail } from '@components/common/item-thumbnail';
import { useMarketPlaceHeadphoneQuery } from 'src/react-query/marketplace';
import { Headphone } from '@models/headphone/headphone';
import { useFilterState } from 'src/recoil/filter';
import { HeadphoneBox } from '@models/headphone-box/headphone-box';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { usePullToRefresh } from '@hooks/use-pull-to-refresh';
import { MotionRefresh } from '@components/common/motion-refresh';
import { useEffect } from 'react';

export function HeadphoneTab() {
    const { open } = useModalDispatch();
    const { level = [], ...rest } = useFilterState(FILTER_ID.HEADPHONE_FILTER) || {};
    const router = useTracksRouter();
    const theme = useTheme();

    const _items = useMarketPlaceHeadphoneQuery({ take: 8, ...rest, levelMoreThen: level[0], levelLessThen: level[1] });

    const { isOpen, isStart, percent, end, containerTarget } = usePullToRefresh({
        handleRefresh() {
            _items.refetch();
        },
        heightForRefresh: 60,
        depth: _items.isLoading,
    });

    useEffect(() => {
        if (!_items.isRefetchSuccess) return;
        end();
    }, [_items.isRefetchSuccess]);

    const items = _items.data || [];

    const handleBuyModalOpenClick = (headphone) => (e) => {
        e.stopPropagation();
        open(MODAL_ID.BUY_ITEM_MODAL, headphone);
    };

    const handleItemCardClick = (itemId: string) => () => {
        router.push(`marketplace/headphone/${itemId}`);
    };

    if (_items.isLoading) {
        return <ListContainer.Skeleton />;
    }

    if (items.length === 0) {
        return (
            <Column sx={{ height: '100%' }}>
                <TRLabel weight="bold">Empty</TRLabel>
            </Column>
        );
    }

    return (
        <>
            <MotionRefresh isOpen={isOpen} isStart={isStart} percent={percent} />
            <ListContainer
                ref={containerTarget}
                style={{ marginTop: '24px' }}
                isCanBeFecthed={!_items.isError}
                doInfinityScrollFunction={_items.fetchNextPage}
            >
                {items.map((item) =>
                    item instanceof Headphone ? (
                        <ItemCard key={item.id} onClick={handleItemCardClick(item.id)}>
                            <ItemThumbnail imgUrl={item.imgUrl} itemId={item.id} quality={item.quality} />
                            <Column alignSelf="stretch" style={{ gap: '8px' }}>
                                <Row alignSelf="stretch" justifyContent="space-between">
                                    <TRLabel sizing="xs">Lv. {item.level}</TRLabel>
                                    <TRLabel sizing="xs">{item.battery}%</TRLabel>
                                    <TRLabel sizing="xs">
                                        {item.mintCount || 0}/{MAX_MINT}
                                    </TRLabel>
                                </Row>
                                <TRDivider.Column />
                                <Row alignSelf="stretch" justifyContent="space-between">
                                    <TRLabel color={theme.palette.text.secondary} sizing="xs">
                                        <TRLabel style={{ marginRight: '4px' }} sizing="xs" weight="bold">
                                            {item.price}
                                        </TRLabel>
                                        {item.sellCurrency}
                                    </TRLabel>

                                    <TRButton
                                        onClick={handleBuyModalOpenClick(item)}
                                        style={{ fontSize: '12px' }}
                                        sizing="xs"
                                        variant="outlined"
                                    >
                                        Buy
                                    </TRButton>
                                </Row>
                            </Column>
                        </ItemCard>
                    ) : item instanceof HeadphoneBox ? (
                        <ItemCard key={item.id}>
                            <ItemThumbnail imgUrl={item.imgUrl} itemId={item.id} quality={item.quality} />
                            <Column alignSelf="stretch" style={{ gap: '8px' }}>
                                <TRDivider.Column />
                                <Row alignSelf="stretch" justifyContent="space-between">
                                    <TRLabel color={theme.palette.text.secondary} sizing="xs">
                                        <TRLabel style={{ marginRight: '4px' }} sizing="xs" weight="bold">
                                            {item.price}
                                        </TRLabel>
                                        {item.sellCurrency}
                                    </TRLabel>

                                    <TRButton
                                        onClick={handleBuyModalOpenClick(item)}
                                        style={{ fontSize: '12px' }}
                                        sizing="xs"
                                        variant="outlined"
                                    >
                                        Buy
                                    </TRButton>
                                </Row>
                            </Column>
                        </ItemCard>
                    ) : null
                )}
                <ModalBuyItem />
            </ListContainer>
        </>
    );
}
