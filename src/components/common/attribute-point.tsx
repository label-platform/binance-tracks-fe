import styled from '@emotion/styled';
import {
    AttributeComfortIcon,
    AttributeEfficiencyIcon,
    AttributeLuckIcon,
    AttributeResilienceIcon,
} from '@icons/index';
import { useMemo } from 'react';
import { Column, Row } from './flex';
import { TRLabel } from './labels/label';
import { LabelWithIcon } from './labels/label-with-icon';

interface Props {
    basePoints: any;
    levelupPoints?: any;
    itemPoints?: any;
    isBase?: boolean;
}

const AttributePointsWrapper = styled(Column)`
    width: 100%;
    gap: 16px;
    & > div {
        width: 100%;
        justify-content: flex-start;
        & > div:first-of-type {
            gap: 2px;
            width: 104px;
            justify-content: flex-start;
        }

        & > span {
            margin-left: auto;
        }
    }

    &.base-attribute > div {
        & .level,
        & .item {
            opacity: 0.38;
        }
    }
`;

interface StatusBarProps {
    base: number;
    dock: number;
    level: number;
}

const StatusBarBase = styled.div<StatusBarProps>`
    width: 172px;
    height: 4px;
    display: flex;
    margin-right: 4px;
    * > span {
        height: 4px;
    }

    & > .base {
        width: ${(props) => props.base}px;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.87), rgba(255, 255, 255, 0.87)), #121212;
    }
    & > .level {
        width: ${(props) => props.level}px;
        background-color: ${(props) => props.theme.palette.primary.main};
    }
    & > .item {
        width: ${(props) => props.dock}px;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
            ${(props) => props.theme.palette.primary.main};
    }
`;

const PointsStatusBar = (props: StatusBarProps) => {
    return (
        <StatusBarBase {...props}>
            <span className="base" />
            <span className="level" />
            <span className="item" />
        </StatusBarBase>
    );
};

export function AttributePoint(props: Props) {
    const { basePoints, itemPoints = {}, levelupPoints = {}, isBase = false } = props;
    const widthUnit = useMemo(() => {
        const max = Math.max(
            ...Object.keys(basePoints).map(
                (key): number => basePoints[key] + (itemPoints[key] || 0) + (levelupPoints[key] || 0)
            )
        );
        return +(172 / max).toFixed(5);
    }, [basePoints, itemPoints, levelupPoints]);

    const calculatedWidth = useMemo(() => {
        return Object.keys(basePoints).reduce(
            (acc: { [key in string]: { base: number; dock: number; level: number } }, key: string) => {
                acc[key] = {
                    base: basePoints[key] * widthUnit,
                    dock: itemPoints[key] * widthUnit,
                    level: levelupPoints[key] * widthUnit,
                };
                return acc;
            },
            {} as any
        );
    }, [basePoints, itemPoints, levelupPoints]);

    if (!basePoints.efficiency) {
        return <></>;
    }

    return (
        <AttributePointsWrapper className={isBase && 'base-attribute'}>
            <Row>
                <LabelWithIcon labelProps={{ sizing: 'xs' }} asIcon={<AttributeEfficiencyIcon />} label="Efficiency" />
                <PointsStatusBar {...calculatedWidth.efficiency} />
                <TRLabel sizing="xs">
                    {isBase
                        ? basePoints.efficiency
                        : basePoints.efficiency + (itemPoints?.efficiency || 0) + (levelupPoints?.efficiency || 0)}
                </TRLabel>
            </Row>
            <Row>
                <LabelWithIcon labelProps={{ sizing: 'xs' }} asIcon={<AttributeLuckIcon />} label="Luck" />
                <PointsStatusBar {...calculatedWidth.luck} />
                <TRLabel sizing="xs">
                    {isBase ? basePoints.luck : basePoints.luck + (itemPoints?.luck || 0) + (levelupPoints?.luck || 0)}
                </TRLabel>
            </Row>
            <Row>
                <LabelWithIcon labelProps={{ sizing: 'xs' }} asIcon={<AttributeComfortIcon />} label="Comfort" />
                <PointsStatusBar {...calculatedWidth.comfort} />
                <TRLabel sizing="xs">
                    {isBase
                        ? basePoints.comfort
                        : basePoints.comfort + (itemPoints?.comfort || 0) + (levelupPoints?.comfort || 0)}
                </TRLabel>
            </Row>
            <Row>
                <LabelWithIcon labelProps={{ sizing: 'xs' }} asIcon={<AttributeResilienceIcon />} label="Resilience" />
                <PointsStatusBar {...calculatedWidth.resilience} />
                <TRLabel sizing="xs">
                    {isBase
                        ? basePoints.resilience
                        : basePoints.resilience + (itemPoints?.resilience || 0) + (levelupPoints?.resilience || 0)}
                </TRLabel>
            </Row>
        </AttributePointsWrapper>
    );
}
