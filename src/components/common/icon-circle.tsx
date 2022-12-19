import styled from '@emotion/styled';
import React, { DOMAttributes } from 'react';
import { ExtendStyleProps } from 'types/track-const-types';

interface Props extends ExtendStyleProps, DOMAttributes<HTMLSpanElement> {
    asIcon: React.ReactNode;
    backgroundColor?: string;
    size?: number;
}

const IconWrapper = styled.span<{ size: number; color: string }>`
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    border-radius: ${(props) => props.size}px;
    background-color: ${(props) => props.color};
    display: inline-flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
`;

export const IconCircle = React.forwardRef((props: Props, ref: any) => {
    const { asIcon, style, backgroundColor = '#121212', size = 12, ...rest } = props;

    return (
        <IconWrapper ref={ref} {...rest} style={style} size={size} color={backgroundColor}>
            {asIcon}
        </IconWrapper>
    );
});

IconCircle.displayName = 'IconCircle';
