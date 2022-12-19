import React, { DOMAttributes, useState } from 'react';
import { ExtendStyleProps } from 'types/track-const-types';
import { Column, Row } from './flex';
import styled from '@emotion/styled';
import { TRButton } from '@components/common/buttons/button';
import { useTheme } from '@emotion/react';
import { TRLabel } from './labels/label';
import { Button } from '@mui/material';

interface Props extends DOMAttributes<HTMLDivElement>, ExtendStyleProps {
    gap?: number;
    initValue?: string;
    titles: Array<string>;
    asStartIcon?: React.ReactElement;
    asLastIcon?: React.ReactElement;
    isFixed?: boolean;
}
const ActiveButton = styled(Button)`
    background-color: ${(props) => props.theme.palette.light.main};
    border-radius: 999px;
`;

const ToggleTabTitles = styled(Row)`
    /* display: flex;
    justify-content: space-between; */
    /* padding: 8px 16px; */
    gap: 8px;
    height: 36px;
    background: #272727;
    box-shadow: inset 0px 1px 4px #000000;
    border-radius: 999px;
    & > div {
        width: 120px;
        height: 20px;
        font-family: 'Gilroy';
        font-size: 16px;
        line-height: 20px;
        text-align: center;
        text-transform: capitalize;
        color: ${(props) => props.theme.palette.text.secondary};
    }
    & > button {
        width: 120px;
        height: 34px;
        text-transform: capitalize;
    }
`;

function ToggleTabContents(props: any) {
    const { value, children, match, ...rest } = props;
    return match === value ? (
        <Column {...rest} style={{ width: '100%', height: '100%', justifyContent: 'flex-start' }}>
            {children}
        </Column>
    ) : null;
}

export function ToggleTabs(props: Props) {
    const { children, titles, initValue, asStartIcon, asLastIcon, isFixed, ...rest } = props;
    const theme = useTheme();
    const [matchTitle, setMatchTitle] = useState<string>(initValue || titles[0]);
    const handleTitle = (value) => () => {
        setMatchTitle(value);
    };
    const newProps = { value: matchTitle };

    return (
        <Column style={{ width: '100%' }}>
            <Row
                justifyContent="space-between"
                style={
                    isFixed
                        ? {
                              padding: '12px 0px',
                              position: 'sticky',
                              width: '100%',
                              top: '0px',
                              zIndex: '4',
                              backgroundColor: theme.palette.dark.main,
                          }
                        : { padding: '12px' }
                }
            >
                {asStartIcon}
                <ToggleTabTitles>
                    {titles.map((title, index) =>
                        title === matchTitle ? (
                            <ActiveButton onClick={handleTitle(title)} key={index}>
                                <TRLabel weight="bold" color={theme.palette.primary.main}>
                                    {title}
                                </TRLabel>
                            </ActiveButton>
                        ) : (
                            <div onClick={handleTitle(title)} key={index}>
                                {title}
                            </div>
                        )
                    )}
                </ToggleTabTitles>
                {asLastIcon}
            </Row>
            <Column {...rest}>
                {React.Children.map(children, (child: any) => React.cloneElement(child, newProps))}
            </Column>
        </Column>
    );
}

ToggleTabs.Contents = ToggleTabContents;
