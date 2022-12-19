import styled from '@emotion/styled';
import { LabelRoundBase, LabelRoundProps } from './label-round';

interface PercentProps extends LabelRoundProps {
    percent: number;
    gageColor?: string;
    width?: number;
    height?: number;
}

const LabelRoundPercentBase = styled(LabelRoundBase)<Omit<PercentProps, 'asLabel'>>`
    position: relative;
    width: ${(props) => (props.width ? `${props.width}px` : 'auto')};
    height: ${(props) => (props.height ? `${props.height}px` : 'auto')};
    background-color: #272727 !important;
    overflow: hidden;
    padding: 4px;
    box-sizing: border-box;
    justify-content: flex-start;
    box-shadow: 0px 1px 4px 0px #000000 inset;
    border: none !important;
    white-space: nowrap;
    &::before {
        content: '';
        position: relative;
        width: ${(props) => props.percent}%;
        background-color: ${(props) => props.gageColor};
        border-radius: 999px;
        height: 100%;
        left: 0px;
        top: 0px;
    }
    & > span {
        z-index: 2;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`;

export function LabelRoundPercent(props: PercentProps) {
    const {
        asLabel,
        color = 'light',
        variant = 'none',
        gageColor = 'rgba(255, 255, 255, 0.38)',
        percent,
        width,
        height,
        ...rest
    } = props;
    return (
        <LabelRoundPercentBase
            width={width}
            height={height}
            gageColor={gageColor}
            variant={variant}
            {...rest}
            percent={percent}
            color={color}
        >
            <span>{asLabel}</span>
        </LabelRoundPercentBase>
    );
}

interface BarPercentProps extends LabelRoundProps {
    maxGage: number;
    gage: number;
    activeColor?: string;
    inactiveColor?: string;
    width?: number;
    height?: number;
    offsetSize?: number;
}

const LabelRoundBarPercentBase = styled(LabelRoundBase)<Partial<BarPercentProps>>`
    position: relative;
    background-color: ${(props) => `${props.theme.palette.primary.main}1f`} !important;
    width: ${(props) => (props.width ? `${props.width}px` : 'auto')};
    height: ${(props) => (props.height ? `${props.height}px` : 'auto')};
    overflow: hidden;
    padding: 4px;
    box-sizing: border-box;
    border: none !important;
    & > span {
        z-index: 2;
    }

    & > .gage-wrapper {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        gap: 2px;
        border-radius: 999px;
        overflow: hidden;
        & > .gage-bar {
            height: 100%;
            flex: 1;
        }
    }
`;

export function LabelRoundBarPercent(props: BarPercentProps) {
    const {
        asLabel,
        maxGage,
        gage,
        width,
        height,
        activeColor = 'rgba(255, 255, 255, 0.87)',
        inactiveColor = 'rgba(255, 255, 255, 0.12)',
        ...rest
    } = props;
    return (
        <LabelRoundBarPercentBase {...rest} width={width} height={height}>
            <span>{asLabel}</span>
            <div className="gage-wrapper">
                {Array(maxGage)
                    .fill('')
                    .map((_, index) => (
                        <span
                            className="gage-bar"
                            style={{ flex: 1, backgroundColor: index + 1 <= gage ? activeColor : inactiveColor }}
                            key={index}
                        />
                    ))}
            </div>
        </LabelRoundBarPercentBase>
    );
}
