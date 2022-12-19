import { Column, Row, TRDivider } from '@components/common/flex';
import { LabelWithIcon } from '@components/common/labels/label-with-icon';
import { ListContainer } from '@components/common/list-container';
import { ItemCard } from '@components/common/item-card';
import { MODAL_ID } from '@constants/common';
import {
    AttributeComfortIcon,
    AttributeEfficiencyIcon,
    AttributeLuckIcon,
    AttributeResilienceIcon,
} from '@icons/index';
import { useStickerListQuery } from 'src/react-query/inventory';
import { useModalDispatch } from 'src/recoil/modal';

import { ModalSticker } from './modal-sticker';
import { StickerIcon } from '@icons/stickers';
import { TRLabel } from '@components/common/labels/label';
import { useTheme } from '@emotion/react';
import { ATTRIBUTE, ITEM_STATUS } from '@models/common.interface';
import { Modal } from '@components/common/modals/modal';
import { useCancelSellQuery } from 'src/react-query/marketplace';
import { LabelRound } from '@components/common/labels/label-round';
import { usePullToRefresh } from '@hooks/use-pull-to-refresh';
import { useEffect } from 'react';
import { MotionRefresh } from '@components/common/motion-refresh';

export function StickerTab() {
    const { open } = useModalDispatch();
    const { palette, clesson } = useTheme();
    const sellCancelQuery = useCancelSellQuery();
    const _sticker = useStickerListQuery({});
    const { isOpen, isStart, percent, end, containerTarget } = usePullToRefresh({
        handleRefresh() {
            _sticker.refetch();
        },
        heightForRefresh: 60,
        depth: _sticker.isLoading,
    });

    useEffect(() => {
        if (!_sticker.isRefetchSuccess) return;
        end();
    }, [_sticker.isRefetchSuccess]);

    const handleModalOpen = (sticker) => {
        if (sticker.status === ITEM_STATUS.SELLING) {
            Modal.confirm({
                title: 'Selling',
                content: (
                    <Column gap={2} style={{ width: '100%' }}>
                        <StickerIcon level={sticker.level} attribute={sticker.attribute} />
                        <LabelRound
                            weight="bold"
                            sizing="xxs"
                            variant="contained"
                            asLabel={sticker.attribute}
                            color={clesson.attribute[sticker.attribute]}
                            style={{ height: '18px', marginTop: '12px' }}
                        />
                        <TRLabel sizing="sm" color={palette.text.secondary}>
                            {sticker.id}
                        </TRLabel>

                        <Row alignSelf="stretch" justifyContent="space-between">
                            <TRLabel>Attribute</TRLabel>
                            <TRLabel weight="bold">
                                +{sticker.plusStat}
                                <TRLabel style={{ marginLeft: '8px' }}>{sticker.attribute}ability</TRLabel>
                            </TRLabel>
                        </Row>
                        <Row alignSelf="stretch" justifyContent="space-between">
                            <TRLabel>Effect</TRLabel>
                            <TRLabel weight="bold">
                                +{sticker.effect}%
                                <TRLabel style={{ marginLeft: '8px' }}>Base {sticker.attribute}</TRLabel>
                            </TRLabel>
                        </Row>
                    </Column>
                ),
                okText: 'Change',
                handleOkClick() {
                    open(MODAL_ID.PRICE_MODIFY_ITEM_MODAL, sticker);
                },
                cancelText: 'Revoke',
                handleCancelClick() {
                    sellCancelQuery.mutate({ sellId: sticker.sellId });
                },
            });
        } else {
            open(MODAL_ID.STICKER_MODAL, sticker);
        }
    };

    if (!_sticker.data) {
        return <ListContainer.Skeleton />;
    }

    if (_sticker.data.length === 0) {
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
                isCanBeFecthed={!_sticker.isError}
                doInfinityScrollFunction={_sticker.fetchNextPage}
                style={{ height: '100%' }}
            >
                {_sticker.data.map((sticker) => (
                    <ItemCard
                        data-test-id="sticker-card"
                        onClick={() => handleModalOpen(sticker)}
                        style={{ justifySelf: 'flex-start' }}
                        key={sticker.id}
                        gap={1}
                        sx={{ position: 'relative' }}
                    >
                        <StickerIcon attribute={sticker.attribute} level={sticker.level} />
                        <span style={{ position: 'absolute', right: '8px', top: '120px' }}>
                            {
                                {
                                    [ATTRIBUTE.COMFORT]: <AttributeComfortIcon />,
                                    [ATTRIBUTE.RESILIENCE]: <AttributeResilienceIcon />,
                                    [ATTRIBUTE.EFFICIENCY]: <AttributeEfficiencyIcon />,
                                    [ATTRIBUTE.LUCK]: <AttributeLuckIcon />,
                                }[sticker.attribute]
                            }
                        </span>
                        <Column alignSelf="stretch" style={{ gap: '8px' }}>
                            <Row alignSelf="stretch" justifyContent="center">
                                <TRLabel color={palette.text.secondary} sizing="sm">
                                    {sticker.id}
                                </TRLabel>
                            </Row>
                            <TRDivider.Column />
                            <Row alignSelf="stretch" justifyContent="space-between">
                                <TRLabel sizing="xs">Lv{sticker.level}</TRLabel>
                                <TRLabel color={clesson.attribute[sticker.attribute]} sizing="xs">
                                    {sticker.effect}%
                                </TRLabel>
                                <TRLabel color={clesson.attribute[sticker.attribute]} sizing="xs">
                                    +{sticker.plusStat}
                                </TRLabel>
                            </Row>
                        </Column>
                    </ItemCard>
                ))}
            </ListContainer>
            <ModalSticker />
        </>
    );
}
