import styled from '@emotion/styled';
import React, { CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import { ExtendStyleProps } from 'types/track-const-types';

interface ItemProps extends ExtendStyleProps {
    anchorOrigin?: {
        vertical: 'top' | 'center' | 'bottom';
        horizon: 'left' | 'center' | 'right';
    };
    children: React.ReactNode;
}

const Badge = styled.div`
    position: absolute;
    z-index: 999;
`;

function BadgeItem(props: ItemProps) {
    const { children, anchorOrigin = { vertical: 'bottom', horizon: 'center' }, style = {} } = props;
    const ref = useRef();
    const [calcStyle, setCalcStyle] = useState<CSSProperties>({});

    useLayoutEffect(() => {
        const originStyle: CSSProperties = {};
        const originHeight = (ref.current as any).clientHeight;
        const originWidth = (ref.current as any).clientWidth;
        switch (anchorOrigin.vertical) {
            case 'top':
            case 'bottom': {
                originStyle[anchorOrigin.vertical] = `calc(0px - ${originHeight / 2}px)`;
                break;
            }
            case 'center': {
                originStyle.top = '50%';
                originStyle.transform = 'translateY(-50%)';
                break;
            }
        }

        switch (anchorOrigin.horizon) {
            case 'left':
            case 'right': {
                originStyle[anchorOrigin.horizon] = `calc(0px - ${originWidth / 2}px)`;
                break;
            }
            case 'center': {
                originStyle.left = '50%';
                originStyle.transform = 'translateX(-50%)';
                break;
            }
        }
        setCalcStyle(originStyle);
    }, []);

    return (
        <Badge ref={ref} style={{ ...style, ...calcStyle }}>
            {children}
        </Badge>
    );
}

interface Props {
    asRoot: React.ReactNode;
    children: React.ReactNode;
}

export function TRBadge(props: Props) {
    const { asRoot, children } = props;

    return React.cloneElement(asRoot as any, {
        children: [children, (asRoot as any).props.children],
        style: { ...((asRoot as any).props?.style || {}), position: 'relative' },
    });
}

TRBadge.Item = BadgeItem;
