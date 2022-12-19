import { Column, Row, TRDivider } from '@components/common/flex';
import { FILTER_ID, MODAL_ID } from '@constants/common';
import {
    AttributeComfortIcon,
    AttributeEfficiencyIcon,
    AttributeLuckIcon,
    AttributeResilienceIcon,
} from '@icons/index';

import { useModalDispatch } from 'src/recoil/modal';
import { ItemCard } from '../common/item-card';

import { ListContainer } from '@components/common/list-container';
import { StickerIcon } from '@icons/stickers';
import { ATTRIBUTE } from '@models/common.interface';
import { TRLabel } from '@components/common/labels/label';
import { useTheme } from '@emotion/react';
import { useMarketPlaceStickerQuery } from 'src/react-query/marketplace';
import { TRButton } from '@components/common/buttons/button';
import { ModalBuyItem } from './modal-buy-item';
import { useEffect } from 'react';
import { usePullToRefresh } from '@hooks/use-pull-to-refresh';
import { MotionRefresh } from '@components/common/motion-refresh';
import { useFilterState } from 'src/recoil/filter';

export function StickerTab() {
    const { open } = useModalDispatch();
    const { palette, clesson } = useTheme();
    const { level = [], ...rest } = useFilterState(FILTER_ID.STICKER_FILTER) || {};
    const _sticker = useMarketPlaceStickerQuery({ take: 8, ...rest, levelLessThen: level[1], levelMoreThen: level[0] });
    const { isOpen, isStart, percent, end, containerTarget } = usePullToRefresh({
        handleRefresh() {
            _sticker.refetch();
        },
        heightForRefresh: 60,
        depth: _sticker.isLoading,
    });

    const handleModalOpen = (sticker) => {
        open(MODAL_ID.BUY_ITEM_MODAL, sticker);
    };

    useEffect(() => {
        if (!_sticker.isRefetchSuccess) return;
        end();
    }, [_sticker.isRefetchSuccess]);

    if (_sticker.isLoading) {
        return <ListContainer.Skeleton />;
    }

    return (
        <>
            <MotionRefresh isOpen={isOpen} isStart={isStart} percent={percent} />
            <ListContainer
                ref={containerTarget}
                style={{ marginTop: '24px' }}
                isCanBeFecthed={!_sticker.isError}
                doInfinityScrollFunction={_sticker.fetchNextPage}
            >
                {_sticker.data.map((sticker) => (
                    <ItemCard
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

                            <Row alignSelf="stretch" justifyContent="space-between">
                                <TRLabel sizing="xs">Lv{sticker.level}</TRLabel>
                                <TRLabel
                                    style={{ marginLeft: 'auto', marginRight: 'auto' }}
                                    color={clesson.attribute[sticker.attribute]}
                                    sizing="xs"
                                >
                                    {sticker.effect}%
                                </TRLabel>
                                <TRLabel color={clesson.attribute[sticker.attribute]} sizing="xs">
                                    +{sticker.plusStat}
                                </TRLabel>
                            </Row>
                            <TRDivider.Column />
                            <Row alignSelf="stretch" justifyContent="space-between">
                                <TRLabel color={palette.text.secondary} sizing="xs">
                                    <TRLabel style={{ marginRight: '4px' }} sizing="xs" weight="bold">
                                        {sticker.price}
                                    </TRLabel>
                                    {sticker.sellCurrency}
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
