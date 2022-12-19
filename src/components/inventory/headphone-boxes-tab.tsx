import { ListContainer } from '@components/common/list-container';
import { ItemCard } from '@components/common/item-card';
import { MODAL_ID } from '@constants/common';
import { useHeadphoneBoxListQuery } from 'src/react-query/inventory';
import { useModalDispatch } from 'src/recoil/modal';
import { ItemThumbnail } from '@components/common/item-thumbnail';
import styled from '@emotion/styled';
import { HeadphoneBox } from '@models/headphone-box/headphone-box';
import { ITEM_STATUS } from '@models/common.interface';
import { Modal } from '@components/common/modals/modal';
import { Column, Row } from '@components/common/flex';
import Image from 'next/image';
import { TRLabel } from '@components/common/labels/label';
import { useCancelSellQuery } from 'src/react-query/marketplace';
import { usePullToRefresh } from '@hooks/use-pull-to-refresh';
import { MotionRefresh } from '@components/common/motion-refresh';
import { useEffect } from 'react';
import { ScreenHeadphoneBox } from '@components/common/screens/screen-headphone-box';
import { ModalTransfer } from '@components/headphone-detail/modal-transfer';

const HeadphoneBoxCard = styled(ItemCard)`
    height: 180px;
`;

export function HeadphoneBoxes() {
    const { open } = useModalDispatch();

    const _headphoneBoxes = useHeadphoneBoxListQuery({});
    const sellCancelQuery = useCancelSellQuery();

    const { isOpen, isStart, percent, end, containerTarget } = usePullToRefresh({
        handleRefresh() {
            _headphoneBoxes.refetch();
        },
        heightForRefresh: 60,
        depth: _headphoneBoxes.isLoading,
    });

    useEffect(() => {
        if (!_headphoneBoxes.isRefetchSuccess) return;
        end();
    }, [_headphoneBoxes.isRefetchSuccess]);

    const handleModalOpenClick = (headphoneBox: HeadphoneBox) => {
        if (headphoneBox.status === ITEM_STATUS.SELLING) {
            Modal.confirm({
                title: 'Selling',
                content: (
                    <Column gap={2} style={{ width: '100%' }}>
                        <Image src={headphoneBox.imgUrl} width={132} height={132} alt="" />
                        <Row alignSelf="stretch" justifyContent="space-between">
                            <TRLabel>Date</TRLabel>
                            <TRLabel weight="bold">{headphoneBox.dateRegisterdSell}</TRLabel>
                        </Row>
                        <Row alignSelf="stretch" justifyContent="space-between">
                            <TRLabel>Price</TRLabel>
                            <TRLabel weight="bold">
                                {headphoneBox.price}
                                <TRLabel style={{ marginLeft: 8 }}>{headphoneBox.sellCurrency}</TRLabel>
                            </TRLabel>
                        </Row>
                    </Column>
                ),
                okText: 'Change',
                handleOkClick() {
                    open(MODAL_ID.PRICE_MODIFY_ITEM_MODAL, headphoneBox);
                },
                cancelText: 'Revoke',
                handleCancelClick() {
                    sellCancelQuery.mutate({ sellId: headphoneBox.sellId });
                },
            });
        } else {
            open(MODAL_ID.HEADPHONE_BOX_MODAL, headphoneBox);
        }
    };

    if (_headphoneBoxes.isLoading) {
        return <ListContainer.Skeleton />;
    }

    if (_headphoneBoxes.data.length === 0) {
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
                isCanBeFecthed={!_headphoneBoxes.isError}
                doInfinityScrollFunction={_headphoneBoxes.fetchNextPage}
                columns={2}
                gap={10}
                style={{ height: '100%' }}
            >
                {_headphoneBoxes.data.map((headphoneBox) => (
                    <HeadphoneBoxCard
                        data-test-id="headphone-box-card"
                        onClick={() => handleModalOpenClick(headphoneBox)}
                        key={headphoneBox.id}
                        gap={2}
                    >
                        <ItemThumbnail
                            imgUrl={headphoneBox.imgUrl}
                            quality={headphoneBox.quality}
                            itemId={headphoneBox.id}
                        />
                    </HeadphoneBoxCard>
                ))}
            </ListContainer>
            <ScreenHeadphoneBox />
            <ModalTransfer />
        </>
    );
}
