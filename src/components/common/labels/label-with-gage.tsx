import styled from '@emotion/styled';
import { Column, Row } from '../flex';

interface Props {
    gage?: number;
    gap?: number;
    color?: string;
    asLeftLabel?: React.ReactNode;
    asRightLabel?: React.ReactNode;
}

const GageWrapper = styled(Row)`
    display: flex;
    justify-content: flex-start;
    width: 100%;
    min-height: 4px;
    position: relative;
    &::before {
        content: '';
        display: inline-block;
        border-radius: 999px;
        position: absolute;
        background-color: rgba(255, 255, 255, 0.12);
        opacity: 0.2;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    }
`;

const GagePercent = styled.span<{ percent: number; color: string }>`
    width: ${(props) => props.percent}%;
    height: 100%;
    background-color: ${(props) => props.color};
    position: absolute;
    border-radius: 24px;
`;

export function LabelWithGage(props: Props) {
    const { asLeftLabel, asRightLabel, gage = 0, color = 'white', gap = 3 } = props;
    return (
        <Column style={{ width: '100%', gap: `${gap}px` }}>
            <Row style={{ width: '100%' }} justifyContent="space-between">
                {asLeftLabel}
                {asRightLabel}
            </Row>
            <GageWrapper>
                <GagePercent color={color} percent={gage} />
            </GageWrapper>
        </Column>
    );
}
