import styled from '@emotion/styled';
import { useIntersectionObserver } from '@hooks/use-intersection-observer';
import { Skeleton } from '@mui/material';
import React, { useEffect } from 'react';
import { ExtendStyleProps } from 'types/track-const-types';
import { Column, Row } from './flex';

interface Props extends ExtendStyleProps {
    columns?: number;
    gap?: number;
    children?: any;
    doInfinityScrollFunction?: () => void;
    isCanBeFecthed?: boolean;
}

const ItemContainer = styled.div<Props>`
    display: grid;
    gap: ${(props) => props.gap}px;
    grid-template-columns: repeat(${(props) => props.columns}, 1fr);
    grid-template-rows: auto;
    align-content: start;
    justify-content: center;
    padding-bottom: 50px;
    overflow-y: auto;
`;

const ListContainer = React.forwardRef((props: Props, ref: any) => {
    const { columns = 2, gap = 5, children, doInfinityScrollFunction, isCanBeFecthed = true, ...rest } = props;
    const { inView, ref: intersectionRef } = useIntersectionObserver();

    useEffect(() => {
        if (inView && isCanBeFecthed) {
            doInfinityScrollFunction && doInfinityScrollFunction();
        }
    }, [inView, doInfinityScrollFunction, isCanBeFecthed]);

    return (
        <ItemContainer ref={ref} columns={columns} gap={gap} {...rest}>
            {children}
            <span ref={intersectionRef} />
        </ItemContainer>
    );
});

function SelfSkeleton() {
    return (
        <Column style={{ width: '100%' }} gap={2}>
            <Row alignSelf="stretch" gap={1}>
                <Column gap={1} sx={{ flex: 1 }}>
                    <Skeleton sx={{ height: 180, width: '100%' }} variant="rounded" />
                    <Skeleton variant="text" sx={{ width: '100%' }} />
                </Column>
                <Column gap={1} sx={{ flex: 1 }}>
                    <Skeleton sx={{ height: 180, width: '100%' }} variant="rounded" />
                    <Skeleton variant="text" sx={{ width: '100%' }} />
                </Column>
            </Row>
            <Row alignSelf="stretch" gap={1}>
                <Column gap={1} sx={{ flex: 1 }}>
                    <Skeleton sx={{ height: 180, width: '100%' }} variant="rounded" />
                    <Skeleton variant="text" sx={{ width: '100%' }} />
                </Column>
                <Column gap={1} sx={{ flex: 1 }}>
                    <Skeleton sx={{ height: 180, width: '100%' }} variant="rounded" />
                    <Skeleton variant="text" sx={{ width: '100%' }} />
                </Column>
            </Row>
            <Row alignSelf="stretch" gap={1}>
                <Column gap={1} sx={{ flex: 1 }}>
                    <Skeleton sx={{ height: 180, width: '100%' }} variant="rounded" />
                    <Skeleton variant="text" sx={{ width: '100%' }} />
                </Column>
                <Column gap={1} sx={{ flex: 1 }}>
                    <Skeleton sx={{ height: 180, width: '100%' }} variant="rounded" />
                    <Skeleton variant="text" sx={{ width: '100%' }} />
                </Column>
            </Row>
        </Column>
    );
}
ListContainer.displayName = 'ListContainer';
const ListContainerNamespace = Object.assign(ListContainer, { Skeleton: SelfSkeleton });
export { ListContainerNamespace as ListContainer };
