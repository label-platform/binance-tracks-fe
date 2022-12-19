import styled from '@emotion/styled';
import React, { DOMAttributes, useState } from 'react';
import { ExtendStyleProps } from 'types/track-const-types';
import { Column, Row } from './flex';

interface Props extends DOMAttributes<HTMLDivElement>, ExtendStyleProps {
    gap?: number;
    defaultValue?: number;
}

const TabTitleComponent = styled(Row)`
    height: 50px;
    width: 100%;
    color: rgba(255, 255, 255, 0.6);
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);

    & > * {
        height: 100%;
        padding: 0px;
        flex: 1;
        line-height: 50px;
        text-align: center;
        position: relative;
    }
    & > .active {
        color: rgba(255, 255, 255, 0.9);
        font-family: Gilroy-Bold;
        &::before {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0px;
            width: 100%;
            height: 2px;
            box-shadow: 0px 0px 2px #ffffff, 0px 0px 4px #387deb, 0px 0px 12px #387deb, 0px 0px 8px #387deb;
            background-color: white;
            z-index: 2;
        }
    }
`;

function TabTitle(props: any) {
    const { handleChange, value, children, ...rest } = props;
    return (
        <TabTitleComponent {...rest}>
            {React.Children.map(children, (child, index) =>
                React.cloneElement(child, {
                    onClick: () => handleChange(index),
                    className: index === value ? 'active' : '',
                })
            )}
        </TabTitleComponent>
    );
}

function TabPanels(props: any) {
    const { value, children, handleChange, ...rest } = props;
    const contents = React.Children.toArray(children);
    return <Column {...rest}>{contents[value]}</Column>;
}

export function Tabs(props: Props) {
    const { children, defaultValue = 0, gap = 0, ...rest } = props;
    const [value, setValue] = useState<number>(defaultValue);
    const handleChange = (index) => {
        setValue(index);
    };
    const newProps = { value, handleChange };
    return (
        <Column {...rest} gap={gap}>
            {React.Children.map(children, (child: any) => React.cloneElement(child, newProps))}
        </Column>
    );
}

Tabs.Titles = TabTitle;
Tabs.Panels = TabPanels;
