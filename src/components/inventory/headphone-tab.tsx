import { Column, Row, TRDivider } from '@components/common/flex';
import { LabelWithIcon } from '@components/common/labels/label-with-icon';
import { ListContainer } from '@components/common/list-container';
import { ItemCard } from '@components/common/item-card';

import {
    AttributeComfortIcon,
    AttributeEfficiencyIcon,
    AttributeLuckIcon,
    AttributeResilienceIcon,
} from '@icons/index';

import { useHeadphoneListQuery } from 'src/react-query/inventory';
import { ItemThumbnail } from '@components/common/item-thumbnail';
import { TRLabel } from '@components/common/labels/label';
import { MAX_MINT } from '@constants/common';
import styled from '@emotion/styled';
import { toInteger2Digits } from '@utils/string';
import { doEither, sendToNative } from '@utils/native';
import { NATIVE_EVENT } from '@constants/native-event';

import { useTracksRouter } from '@hooks/use-tracks-router';
import { usePullToRefresh } from '@hooks/use-pull-to-refresh';
import { useEffect, useRef } from 'react';
import { MotionRefresh } from '@components/common/motion-refresh';

const AttributeLabel = styled(LabelWithIcon)`
    & > span {
        width: 14px;
        height: 24px;
        & > svg {
            transform: scale(0.7) translate(-6px, -2px);
        }
    }
`;

export function HeadphoneTab() {
    const _headphones = useHeadphoneListQuery({ take: 8 });
    const headphones = _headphones.data || [];
    const router = useTracksRouter();

    const { isOpen, isStart, percent, end, containerTarget } = usePullToRefresh({
        handleRefresh() {
            _headphones.refetch();
        },
        heightForRefresh: 60,
        depth: _headphones.isLoading,
    });

    useEffect(() => {
        if (!_headphones.isRefetchSuccess) return;
        end();
    }, [_headphones.isRefetchSuccess]);

    const handleGotoHeadphoneDetailClick = (headphoneID: string) => () => {
        doEither(
            () => {
                router.push(`/headphone/${headphoneID}`);
            },
            () => {
                sendToNative({
                    name: NATIVE_EVENT.SET_NO_BOTTOM_MENU,
                    params: { url: `/headphone/${headphoneID}` },
                });
            }
        );
    };

    if (_headphones.isLoading) {
        return <ListContainer.Skeleton />;
    }

    if (headphones.length === 0) {
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
                isCanBeFecthed={!_headphones.isError}
                gap={10}
                doInfinityScrollFunction={_headphones.fetchNextPage}
                style={{ height: '100%' }}
            >
                {headphones.map((headphone) => (
                    <ItemCard
                        data-test-id="headphone-card"
                        key={headphone.id}
                        onClick={handleGotoHeadphoneDetailClick(headphone.id)}
                    >
                        <ItemThumbnail
                            itemStatus={headphone.status}
                            imgUrl={headphone.imgUrl}
                            itemId={headphone.id}
                            quality={headphone.quality}
                        />
                        <Column alignSelf="stretch" style={{ gap: '8px' }}>
                            <Row alignSelf="stretch" justifyContent="space-between">
                                <TRLabel sizing="xs">Lv. {headphone.level}</TRLabel>
                                <TRLabel sizing="xs">{headphone.battery}%</TRLabel>
                                <TRLabel sizing="xs">
                                    {headphone.mintCount || 0}/{MAX_MINT}
                                </TRLabel>
                            </Row>
                            <TRDivider.Column />
                            <Row style={{ height: '14px' }} alignSelf="stretch" justifyContent="space-between">
                                <AttributeLabel
                                    labelProps={{ sizing: 'xxs' }}
                                    asIcon={<AttributeEfficiencyIcon />}
                                    label={`${headphone.points.total.efficiency}`}
                                />
                                <AttributeLabel
                                    labelProps={{ sizing: 'xxs' }}
                                    asIcon={<AttributeLuckIcon />}
                                    label={`${headphone.points.total.luck}`}
                                />
                                <AttributeLabel
                                    labelProps={{ sizing: 'xxs' }}
                                    asIcon={<AttributeComfortIcon />}
                                    label={`${headphone.points.total.comfort}`}
                                />
                                <AttributeLabel
                                    labelProps={{ sizing: 'xxs' }}
                                    asIcon={<AttributeResilienceIcon />}
                                    label={`${headphone.points.total.resilience}`}
                                />
                            </Row>
                        </Column>
                    </ItemCard>
                ))}
            </ListContainer>
        </>
    );
}
