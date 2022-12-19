import styled from '@emotion/styled';
import { Button, ButtonProps } from '@mui/material';
import React from 'react';
import { ColorGuard, SizeGurad } from 'types/track-const-types';

interface Props extends Omit<ButtonProps, 'color' | 'size'> {
    color?: ColorGuard;
    sizing?: SizeGurad;
}

function calculateWidth(size: SizeGurad) {
    switch (size) {
        case 'xs':
            return 60;
        case 'sm':
            return 120;
        case 'md':
            return 180;
        case 'lg':
            return 280;
        case 'xl':
            return 312;
        default:
            return undefined;
    }
}

function calculateHeight(size: SizeGurad) {
    switch (size) {
        case 'xs':
            return 20;
        case 'sm':
            return 32;
        case 'md':
            return 36;
        case 'lg':
        case 'xl':
            return 56;
        default:
            return undefined;
    }
}

const BaseButton = styled(Button)<Props>`
    border-radius: 999px;
    font-weight: 700;
    font-size: 16px;
    text-transform: none;
    box-sizing: border-box;
    min-width: 60px;
    white-space: nowrap;
    width: ${(props) => `${calculateWidth(props.sizing)}px`};
    height: ${(props) => `${calculateHeight(props.sizing)}px`};
    background-color: ${(props) =>
        props.variant === 'contained' ? props.theme.palette[props.color].main : 'rgba(255, 255, 255, 0.12)'} !important;
    color: ${(props) =>
        props.variant === 'outlined'
            ? props.theme.palette[props.color].main
            : props.theme.palette.light.main} !important;
    &:disabled {
        color: ${(props) => props.theme.palette.text.disabled} !important;
    }
    &:hover {
        background-color: ${(props) => props.theme.palette[props.color].light};
    }
`;

export const TRButton = React.forwardRef((props: Props, ref: any) => {
    const { color = 'primary', sizing = 'md', children, variant = 'contained', ...rest } = props;

    return (
        <BaseButton variant={variant} color={color as any} sizing={sizing} ref={ref} {...rest}>
            {children}
        </BaseButton>
    );
});

TRButton.displayName = 'TRButton';
