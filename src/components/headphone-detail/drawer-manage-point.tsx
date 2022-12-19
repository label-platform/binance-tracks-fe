import { TRButton } from '@components/common/buttons/button';
import { TRIconButton } from '@components/common/buttons/icon-button';
import { Drawer } from '@components/common/drawer';
import { Column, Row } from '@components/common/flex';

import { TRLabel } from '@components/common/labels/label';
import { LabelWithIcon } from '@components/common/labels/label-with-icon';

import { DRAWER_ID } from '@constants/common';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { AttributeComfortIcon, AttributeEfficiencyIcon, AttributeLuckIcon, AttributeResilienceIcon } from '@icons';
import RemoveIcon from '@mui/icons-material/Remove';
import { Headphone } from '@models/headphone/headphone';
import { Close } from '@mui/icons-material';

import { useEffect, useState } from 'react';
import { useStatUpHeadphone } from 'src/react-query/inventory';
import { useDrawerDispatch, useDrawerState } from 'src/recoil/drawer';
import AddIcon from '@mui/icons-material/Add';
import { ATTRIBUTE, ATTRIBUTE_GUARD } from '@models/common.interface';
import { toInteger2Digits } from '@utils/string';
import { useIsOnNative } from '@utils/native';
import { useIsMiniPlayerOn } from '@hooks/use-is-miniplayer-on';

interface Props {
    headphone?: Headphone;
}

const PointIconButton = styled(TRIconButton)`
    width: 16px;
    height: 16px;
    & svg {
        width: 100%;
    }
    &:disabled {
        & svg {
            fill: #7c7c7c !important;
        }
    }
`;

export function DrawerManagePoint(props: Props) {
    const { headphone } = props;
    const { close } = useDrawerDispatch();
    const isMiniplayerOn = useIsMiniPlayerOn();
    const isOpen = useDrawerState(DRAWER_ID.MANAGE_POINT);
    const { palette } = useTheme();
    const [availablePoint, setAvailablePoint] = useState<number>(0);
    const { mutate } = useStatUpHeadphone();

    const [stat, setStat] = useState<Record<ATTRIBUTE_GUARD, number>>({
        [ATTRIBUTE.COMFORT]: 0,
        [ATTRIBUTE.EFFICIENCY]: 0,
        [ATTRIBUTE.LUCK]: 0,
        [ATTRIBUTE.RESILIENCE]: 0,
    });

    useEffect(() => {
        setAvailablePoint(headphone.points.remain);
        setStat({
            [ATTRIBUTE.COMFORT]: 0,
            [ATTRIBUTE.EFFICIENCY]: 0,
            [ATTRIBUTE.LUCK]: 0,
            [ATTRIBUTE.RESILIENCE]: 0,
        });
    }, [isOpen]);

    const handleSelectDockeClose = () => {
        close(DRAWER_ID.MANAGE_POINT);
    };

    const handlePointMinusClick = (attribute: ATTRIBUTE_GUARD) => () => {
        setStat((prevStat) => ({
            ...prevStat,
            [attribute]: prevStat[attribute] - 1,
        }));
        setAvailablePoint((point) => point + 1);
    };

    const handlePointPlusClick = (attribute: ATTRIBUTE_GUARD) => () => {
        setStat((prevStat) => ({
            ...prevStat,
            [attribute]: prevStat[attribute] + 1,
        }));
        setAvailablePoint((point) => point - 1);
    };

    const handleConfirmClick = () => {
        mutate(
            {
                headphoneId: headphone.id,
                points: stat,
            },
            {
                onSettled() {
                    close(DRAWER_ID.MANAGE_POINT);
                },
            }
        );
    };

    return (
        <Drawer
            paperSx={{
                marginBottom: isMiniplayerOn ? '105px' : '10px',
                minHeight: 368,
            }}
            onClose={handleSelectDockeClose}
            from="bottom"
            drawerID={DRAWER_ID.MANAGE_POINT}
            widthPercent={100}
            heightPercent={0}
        >
            <Column style={{ padding: '16px 32px', width: '100%' }}>
                <Row style={{ width: '100%' }} justifyContent="flex-end">
                    <Close onClick={handleSelectDockeClose} />
                </Row>
                <Column gap={2} style={{ width: '100%' }}>
                    <TRLabel sizing="lg" weight="bold">
                        Add Points
                    </TRLabel>
                    <Row>
                        <TRLabel color={palette.text.secondary} sizing="sm">
                            Available points:{' '}
                            <TRLabel weight="bold" style={{ marginLeft: 8 }}>
                                {availablePoint}
                            </TRLabel>
                        </TRLabel>
                    </Row>
                    <Row alignSelf="stretch" justifyContent="space-between">
                        <LabelWithIcon asIcon={<AttributeEfficiencyIcon />} label="Efficiency" />
                        <Row gap={2}>
                            <PointIconButton
                                disabled={stat[ATTRIBUTE.EFFICIENCY] === 0}
                                onClick={handlePointMinusClick(ATTRIBUTE.EFFICIENCY)}
                                asIcon={<RemoveIcon />}
                            />
                            <TRLabel sizing="sm" weight="bold">
                                {toInteger2Digits(headphone.points.total.efficiency + stat.efficiency)}
                            </TRLabel>
                            <PointIconButton
                                disabled={availablePoint === 0}
                                onClick={handlePointPlusClick(ATTRIBUTE.EFFICIENCY)}
                                asIcon={<AddIcon />}
                            />
                        </Row>
                    </Row>
                    <Row alignSelf="stretch" justifyContent="space-between">
                        <LabelWithIcon asIcon={<AttributeLuckIcon />} label="Luck" />
                        <Row gap={2}>
                            <PointIconButton
                                disabled={stat[ATTRIBUTE.LUCK] === 0}
                                onClick={handlePointMinusClick(ATTRIBUTE.LUCK)}
                                asIcon={<RemoveIcon />}
                            />
                            <TRLabel sizing="sm" weight="bold">
                                {toInteger2Digits(headphone.points.total.luck + stat.luck)}
                            </TRLabel>
                            <PointIconButton
                                disabled={availablePoint === 0}
                                onClick={handlePointPlusClick(ATTRIBUTE.LUCK)}
                                asIcon={<AddIcon />}
                            />
                        </Row>
                    </Row>
                    <Row alignSelf="stretch" justifyContent="space-between">
                        <LabelWithIcon asIcon={<AttributeComfortIcon />} label="Comfort" />
                        <Row gap={2}>
                            <PointIconButton
                                disabled={stat[ATTRIBUTE.COMFORT] === 0}
                                onClick={handlePointMinusClick(ATTRIBUTE.COMFORT)}
                                asIcon={<RemoveIcon />}
                            />
                            <TRLabel sizing="sm" weight="bold">
                                {toInteger2Digits(headphone.points.total.comfort + stat.comfort)}
                            </TRLabel>
                            <PointIconButton
                                disabled={availablePoint === 0}
                                onClick={handlePointPlusClick(ATTRIBUTE.COMFORT)}
                                asIcon={<AddIcon />}
                            />
                        </Row>
                    </Row>
                    <Row alignSelf="stretch" justifyContent="space-between">
                        <LabelWithIcon asIcon={<AttributeResilienceIcon />} label="Resilience" />
                        <Row gap={2}>
                            <PointIconButton
                                disabled={stat[ATTRIBUTE.RESILIENCE] === 0}
                                onClick={handlePointMinusClick(ATTRIBUTE.RESILIENCE)}
                                asIcon={<RemoveIcon />}
                            />
                            <TRLabel sizing="sm" weight="bold">
                                {toInteger2Digits(headphone.points.total.resilience + stat.resilience)}
                            </TRLabel>
                            <PointIconButton
                                disabled={availablePoint === 0}
                                onClick={handlePointPlusClick(ATTRIBUTE.RESILIENCE)}
                                asIcon={<AddIcon />}
                            />
                        </Row>
                    </Row>
                    <TRButton
                        disabled={headphone.points.remain === availablePoint}
                        onClick={handleConfirmClick}
                        style={{ position: 'absolute', bottom: 26, width: 296 }}
                    >
                        Confirm
                    </TRButton>
                </Column>
            </Column>
        </Drawer>
    );
}
