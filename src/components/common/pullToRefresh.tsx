import React from 'react';
import Refresh from 'react-simple-pull-to-refresh';
import { Row } from '@components/common/flex/index';
import styled from '@emotion/styled';
import Image from 'next/image';
interface Props {
    children: React.ReactElement;
    onRefresh: () => Promise<any>;
}
const PullDownEvent = styled(Row)`
    gap: 4px;
    align-items: center;
    justify-content: center;
    background: linear-gradient(0deg, rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.8)),
        linear-gradient(180deg, #121212 0%, #387deb 49.48%, #121212 100%);
    height: 40px;
    width: 100vw;
    font-family: 'Gilroy';
    font-size: 14px;
    color: #ffffff;
    text-shadow: 0px 0px 2px #ffffff, 0px 0px 4px #387deb, 0px 0px 12px #387deb, 0px 0px 8px #387deb;
`;
const PullDownContainer = styled.div`
    width: 100%;
    & .ptr {
        overflow: unset;
    }
    & .ptr__pull-down {
        overflow: unset;
    }
    & .ptr__children {
        overflow: unset !important;
    }
`;

export const ContainerPullToRefresh = (props: Props) => {
    const { children, onRefresh } = props;

    return (
        <PullDownContainer>
            <Refresh
                onRefresh={onRefresh}
                pullingContent={
                    <PullDownEvent>
                        <Image src="/images/reload-symbol.png" alt="reloadSymbol" width={42} height={42} />
                    </PullDownEvent>
                }
                refreshingContent={
                    <PullDownEvent>
                        <Image src="/images/reload-check-symbol.png" alt="reloadSymbol" width={24} height={24} />
                        <div>Refresh Completed</div>
                    </PullDownEvent>
                }
                maxPullDownDistance={50}
                pullDownThreshold={50}
                resistance={8}
            >
                {children}
            </Refresh>
        </PullDownContainer>
    );
};
