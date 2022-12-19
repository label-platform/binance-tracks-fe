import React from 'react';
import styled from '@emotion/styled';
// import { Row } from '@components/common/flex/index;
import { Row } from '@components/common/flex/index';

const Container = styled(Row)`
    width: 312px;
    height: 250px;
    font-family: 'Syncopate-Bold';
    font-size: 20px;
    line-height: 100%;
    text-transform: uppercase;
    -webkit-text-stroke: 1px ${(props) => props.theme.palette.text.disabled};
    letter-spacing: 0.057em;
    color: ${(props) => props.theme.palette.dark.main};
    text-align: center;
`;

export const EmptyLabel = ({ message }: { message: string }) => {
    return <Container>{message}</Container>;
};
