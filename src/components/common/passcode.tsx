import React, { useState } from 'react';
import { Row, Column } from './flex';
import styled from '@emotion/styled';
import { Close } from '@mui/icons-material';
import ReplayIcon from '@mui/icons-material/Replay';
import { useTheme } from '@emotion/react';

interface Props {
    passcode: number[];
    handleDeleteButtonClick: any;
    handlePasscodeKeypadClick: any;
    reset: any;
}

export const PasscodeInput = ({ passcode }: any) => {
    const theme = useTheme();

    return (
        <Row gap={2}>
            {[...passcode, ...Array(6 - passcode.length)].map((value, index) => (
                <div
                    data-test-id="passcode-input"
                    key={index}
                    style={{
                        border: `1px solid ${theme.palette.primary.light} `,
                        width: '16px',
                        height: '16px',
                        borderRadius: '100%',
                        backgroundColor: `${value || value === 0 ? theme.palette.primary.light : '#121212'}`,
                    }}
                />
            ))}
        </Row>
    );
};

export const Keypad = styled.button`
    width: 60px;
    height: 60px;
    border-radius: 100%;
    background-color: ${(props) => `${props.theme.palette.primary.main}1f`};
    border: none;
    & > span {
        font-weight: bold;
        color: ${(props) => props.theme.palette.light.main};
        font-size: 32px;
    }

    & > svg {
        transition: 0s;
        color: ${(props) => props.theme.palette.primary.main};
    }

    &:active {
        background-color: ${(props) => `${props.theme.palette.primary.main}3d`};
    }
`;

export const PasscodeKeypad = (dispatch: any) => (
    <Column style={{ width: '260px', height: '324px', gap: '28px' }}>
        <Row justifyContent="space-between" style={{ width: '100%' }}>
            {[1, 2, 3].map((value) => (
                <Keypad key={value} onClick={(e) => dispatch.handlePasscodeKeypadClick(e, value)}>
                    <span>{value}</span>
                </Keypad>
            ))}
        </Row>
        <Row justifyContent="space-between" style={{ width: '100%' }}>
            {[4, 5, 6].map((value) => (
                <Keypad key={value} onClick={(e) => dispatch.handlePasscodeKeypadClick(e, value)}>
                    <span>{value}</span>
                </Keypad>
            ))}
        </Row>
        <Row justifyContent="space-between" style={{ width: '100%' }}>
            {[7, 8, 9].map((value) => (
                <Keypad key={value} onClick={(e) => dispatch.handlePasscodeKeypadClick(e, value)}>
                    <span>{value}</span>
                </Keypad>
            ))}
        </Row>
        <Row justifyContent="space-between" style={{ width: '100%' }}>
            <Keypad onClick={() => dispatch.reset()}>
                <ReplayIcon />
            </Keypad>
            <Keypad onClick={(e) => dispatch.handlePasscodeKeypadClick(e, 0)}>
                <span>0</span>
            </Keypad>
            <Keypad data-test-id="delete-button" onClick={() => dispatch.handleDeleteButtonClick()}>
                <Close />
            </Keypad>
        </Row>
    </Column>
);

export function Passcode(props: Props) {
    const { passcode, handleDeleteButtonClick, handlePasscodeKeypadClick, reset } = props;

    return (
        <Column style={{ gap: '105px' }}>
            <PasscodeInput passcode={passcode} />
            <PasscodeKeypad
                handleDeleteButtonClick={handleDeleteButtonClick}
                handlePasscodeKeypadClick={handlePasscodeKeypadClick}
                reset={reset}
            />
        </Column>
    );
}

export function usePasscode() {
    const [passcode, setPasscode] = useState<Array<number>>([]);

    const handlePasscodeKeypadClick = (e, value) => {
        if (passcode.length > 5) return;
        setPasscode((prevPasscode) => [...prevPasscode, value]);
    };

    const handleDeleteButtonClick = (e) => {
        const _passcode = new Array<number>();
        for (let i = 0; i < passcode.length - 1; i++) {
            _passcode.push(passcode[i]);
        }
        setPasscode(_passcode);
    };

    const reset = () => {
        setPasscode([]);
    };
    return {
        handleDeleteButtonClick,
        handlePasscodeKeypadClick,
        passcode,
        reset,
    };
}
