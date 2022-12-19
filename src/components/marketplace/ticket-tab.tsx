import { Column, Row, TRDivider } from '@components/common/flex';
import { FILTER_ID, MODAL_ID } from '@constants/common';
import { useModalDispatch } from 'src/recoil/modal';
import { ItemCard } from '../common/item-card';
import { ListContainer } from '@components/common/list-container';
import { TRLabel } from '@components/common/labels/label';
import { useTheme } from '@emotion/react';
import { useMarketPlaceTicketQuery } from 'src/react-query/marketplace';
import { TRButton } from '@components/common/buttons/button';
import { ModalBuyItem } from './modal-buy-item';
import { useEffect } from 'react';
import { usePullToRefresh } from '@hooks/use-pull-to-refresh';
import { MotionRefresh } from '@components/common/motion-refresh';
import { useFilterState } from 'src/recoil/filter';
import { ItemThumbnail } from '@components/common/item-thumbnail';

export function TicketTab() {
    const { open } = useModalDispatch();
    const { palette, clesson } = useTheme();
    const { level = [], ...rest } = useFilterState(FILTER_ID.STICKER_FILTER) || {};
    const _tickets = useMarketPlaceTicketQuery({
        take: 8,
        ...rest,
        levelLessThen: level[1],
        levelMoreThen: level[0],
    });
    const { isOpen, isStart, percent, end, containerTarget } = usePullToRefresh({
        handleRefresh() {
            _tickets.refetch();
        },
        heightForRefresh: 60,
        depth: _tickets.isLoading,
    });

    const handleModalOpen = (ticket) => {
        open(MODAL_ID.BUY_ITEM_MODAL, ticket);
    };

    useEffect(() => {
        if (!_tickets.isRefetchSuccess) return;
        end();
    }, [_tickets.isRefetchSuccess]);

    if (_tickets.isLoading) {
        return <ListContainer.Skeleton />;
    }

    return (
        <>
            <MotionRefresh isOpen={isOpen} isStart={isStart} percent={percent} />
            <ListContainer
                ref={containerTarget}
                style={{ marginTop: '24px' }}
                isCanBeFecthed={!_tickets.isError}
                doInfinityScrollFunction={_tickets.fetchNextPage}
            >
                {_tickets.data.map((ticket) => (
                    <ItemCard
                        onClick={() => handleModalOpen(ticket)}
                        style={{ justifySelf: 'flex-start' }}
                        key={ticket.id}
                        gap={1}
                        sx={{ position: 'relative' }}
                    >
                        <ItemThumbnail imgUrl={ticket.imgUrl} itemId={ticket.id} />
                        <Column alignSelf="stretch" style={{ gap: '8px' }}>
                            <TRDivider.Column />
                            <Row alignSelf="stretch" justifyContent="space-between">
                                <TRLabel color={palette.text.secondary} sizing="xs">
                                    <TRLabel style={{ marginRight: '4px' }} sizing="xs" weight="bold">
                                        {ticket.price}
                                    </TRLabel>
                                    {ticket.sellCurrency}
                                </TRLabel>
                                <TRButton style={{ fontSize: '12px' }} sizing="xs" variant="outlined">
                                    Buy
                                </TRButton>
                            </Row>
                        </Column>
                    </ItemCard>
                ))}
            </ListContainer>

            <ModalBuyItem />
        </>
    );
}
