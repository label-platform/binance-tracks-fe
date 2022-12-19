import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { DOMAttributes } from 'react';
import { ColorGuard, ExtendStyleProps, SizeGurad, VariantGuard, WeightGuard } from 'types/track-const-types';

type LabelSizeGuard = SizeGurad | 'xxl' | 'ml' | 'xxs';

interface Props extends ExtendStyleProps, DOMAttributes<HTMLSpanElement> {
    color?: ColorGuard | string;
    weight?: WeightGuard;
    sizing?: LabelSizeGuard;
    variant?: VariantGuard;
    disabled?: boolean;
    id?: string;
}

const calculateFontSize = (size: LabelSizeGuard) => {
    switch (size) {
        case 'xxs':
            return '10px';
        case 'xs':
            return '12px';
        case 'sm':
            return '14px';
        case 'md':
            return '16px';
        case 'ml':
            return '18px';
        case 'lg':
            return '24px';
        case 'xl':
            return '28px';
        case 'xxl':
            return '32px';
    }
};

const BaseLabel = styled.span<Props>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: ${(props) => calculateFontSize(props.sizing)};
    font-family: ${(props) =>
        props.weight === 'medium' ? 'Gilroy' : props.weight === 'bold' ? 'Gilroy-Bold' : 'Gilroy-ExtraBold'};
`;

export function TRLabel(props: Props) {
    const {
        color = 'light',
        weight = 'medium',
        variant = 'none',
        sizing = 'md',
        disabled = false,
        style,
        ...rest
    } = props;
    const theme = useTheme();
    const mainColor = theme.palette[color] ? theme.palette[color].main : color;

    let fontColor: string = mainColor;
    let borderColor: string = mainColor;
    let backgroundColor: string = mainColor;

    if (variant === 'contained') {
        fontColor = color === 'dark' ? theme.palette['light'].main : theme.palette['dark'].main;
    } else if (variant === 'none') {
        borderColor = 'transparent';
        backgroundColor = 'transparent';
    } else {
        backgroundColor = 'transparent';
    }

    if (disabled) fontColor = theme.palette.text.disabled;

    return (
        <BaseLabel
            sizing={sizing}
            style={{ color: fontColor, backgroundColor, border: `1px solid ${borderColor}`, ...style }}
            weight={weight}
            color={color}
            {...rest}
        />
    );
}

export type { Props as TRLabelProps };
