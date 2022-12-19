import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { IconButton as MuiIConButton, IconButtonProps } from '@mui/material';
import React from 'react';
import { ColorGuard, SizeGurad } from 'types/track-const-types';

interface Props extends Omit<IconButtonProps, 'color' | 'size'> {
    asIcon: React.ReactElement;
    sizing?: SizeGurad;
    color?: ColorGuard | string;
    variant?: 'outlined' | 'contained' | 'none' | 'filled';
}

function calculateButtonSize(size: SizeGurad) {
    switch (size) {
        case 'xs':
            return '24px';
        case 'sm':
            return '28px';
        case 'md':
            return '32px';
        case 'lg':
            return '36px';
        case 'xl':
            return '40px';
        default:
            return null;
    }
}

function calculateIconSize(size: SizeGurad) {
    switch (size) {
        case 'xs':
        case 'sm':
            return '20px';
        case 'md':
            return '24px';
        case 'lg':
            return '28px';
        case 'xl':
            return '32px';
        default:
            return null;
    }
}

const IconButtonBase = styled(MuiIConButton)<
    Partial<Props> & { fillcolor: string; bordercolor: string; bgcolor: string }
>`
    padding: 6px;
    font-size: ${(props) => calculateIconSize(props.sizing)};
    width: ${(props) => calculateButtonSize(props.sizing)};
    height: ${(props) => calculateButtonSize(props.sizing)};
    border-radius: 100%;
    position: relative;
    & > svg {
        z-index: 3;
        width: ${(props) => calculateIconSize(props.sizing)} !important;
        height: ${(props) => calculateIconSize(props.sizing)} !important;
        fill: ${(props) => props.fillcolor} !important;
    }
    background-color: ${(props) => props.bgcolor};

    border: ${(props) => {
        switch (props.variant) {
            case 'contained':
            case 'outlined':
                return `1px solid ${props.bordercolor}`;
            case 'none':
                return '1px solid transparent';
        }
    }};
`;

export const TRIconButton = React.forwardRef((props: Props, ref: any): JSX.Element => {
    const { asIcon, color = 'primary', variant = 'contained', sizing, ...rest } = props;
    const theme = useTheme();
    const mainColor = theme.palette[color] ? theme.palette[color].main : color;

    let fillColor: string = mainColor;
    let borderColor: string = mainColor;
    let bgColor: string = mainColor;

    if (variant === 'contained') {
        fillColor = color === 'light' ? theme.palette['dark'].main : theme.palette['light'].main;
    } else if (variant === 'none') {
        borderColor = 'transparent';
        bgColor = 'transparent';
    } else if (variant === 'filled') {
        borderColor = 'transparent';
        bgColor = 'rgba(255, 255, 255, 0.12)';
    } else {
        bgColor = 'rgba(255, 255, 255, 0.12)';
    }

    return (
        <IconButtonBase
            sizing={sizing}
            variant={variant}
            bordercolor={borderColor}
            fillcolor={fillColor}
            bgcolor={bgColor}
            ref={ref}
            {...rest}
        >
            {asIcon}
        </IconButtonBase>
    );
});

TRIconButton.displayName = 'TRIconButton';
