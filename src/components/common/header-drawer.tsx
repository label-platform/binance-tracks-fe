import styled from '@emotion/styled';
import React, { DOMAttributes, HTMLProps } from 'react';
import { ExtendStyleProps } from 'types/track-const-types';
import { Row } from './flex';
import { TRLabel } from './labels/label';

export const Header = styled(Row)`
    position: relative;
    margin-bottom: 50px;
    height: 52px;
    width: 100%;
    margin-bottom: 50px;
    & > .start-icon {
        position: absolute;
        left: 0px;
    }
    & > .end-icon {
        position: absolute;
        right: 0px;
    }
`;

interface Props extends DOMAttributes<HTMLDivElement>, ExtendStyleProps {
    title: string;
    asLeftIcon?: React.ReactElement;
    asRightIcon?: React.ReactElement;
}

export function HeaderDrawer(props: Props) {
    const { title, asLeftIcon, asRightIcon, ...rest } = props;
    return (
        <Header {...rest}>
            {asLeftIcon ? <span className="start-icon">{asLeftIcon}</span> : null}
            <TRLabel sizing="ml" weight="bold">
                {title}
            </TRLabel>
            {asRightIcon ? <span className="end-icon">{asRightIcon}</span> : null}
        </Header>
    );
}
