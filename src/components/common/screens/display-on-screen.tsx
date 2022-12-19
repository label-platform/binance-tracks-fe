import styled from '@emotion/styled';
import { StackProps } from '@mui/material';
import { DOMAttributes } from 'react';

import ReactDOM from 'react-dom';
import { useScreenState } from 'src/recoil/screen';
import { Column } from '../flex';

interface Props extends DOMAttributes<HTMLDivElement>, Omit<StackProps, 'direction'> {
    screenID: string;
}

const TopWrapper = styled(Column)`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 1200;
    background-color: rgba(18, 18, 18, 0.9);
`;

export function DisplayOnScreen(props: Props) {
    const { children, screenID, ...rest } = props;
    const container = document.getElementById('screen-top');
    const { visible } = useScreenState(screenID);
    if (!visible || !container) return <></>;
    return ReactDOM.createPortal(<TopWrapper {...rest}>{children}</TopWrapper>, container);
}
