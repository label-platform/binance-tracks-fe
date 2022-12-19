import React from 'react';

import MuiDialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import styled from '@emotion/styled';
import { Column, Row } from '../flex';
import { TRIconButton } from '../buttons/icon-button';
import { TRLabel } from '../labels/label';
import { Backdrop } from '@mui/material';

export interface Props extends DialogProps {
    asTitle?: React.ReactNode;
    asFooter?: React.ReactNode;
    asCloseIcon?: React.ReactNode;
    children: React.ReactNode;
}

const WhiteBackDrop = styled(Backdrop)`
    background-color: rgba(44, 44, 44, 0.8);
    opacity: 0.6;
`;

const Dialog = styled(MuiDialog)`
    & .MuiDialog-container {
        & > .MuiPaper-root {
            width: 312px;
            border-radius: 16px;
            background-color: ${(props) => props.theme.palette.dark.main};
            padding: 14px 32px 32px 32px;
            box-sizing: border-box;
            & > .MuiDialogContent-root {
                padding: 0px;
                width: 100%;
            }
        }
    }
`;

const Header = styled(Column)`
    font-weight: bold;
    font-size: 1.2rem;
    width: 100%;
`;

function CustomDialogHeader(props: any) {
    const { title, closeIcon, onClose } = props;
    return (
        <Header gap={0}>
            {closeIcon ? (
                <Row justifyContent="flex-end" style={{ width: '100%', marginRight: '-34px' }}>
                    <TRIconButton
                        variant="none"
                        color="light"
                        style={{ padding: '5px' }}
                        onClick={onClose}
                        asIcon={closeIcon}
                    />
                </Row>
            ) : null}
            {title ? (
                <TRLabel sizing="lg" weight="bold" style={{ width: '100%', textAlign: 'center' }}>
                    {title}
                </TRLabel>
            ) : null}
        </Header>
    );
}

export function CustomDialog(props: Props) {
    const { asTitle, asFooter, asCloseIcon, children, ...rest } = props;

    return (
        <Dialog BackdropComponent={WhiteBackDrop} {...rest}>
            {asTitle || asCloseIcon ? (
                <CustomDialogHeader title={asTitle} closeIcon={asCloseIcon} onClose={props.onClose} />
            ) : null}
            <DialogContent>{children}</DialogContent>
            {asFooter ? (
                <DialogActions style={{ width: '100%', boxSizing: 'border-box', padding: 0 }}>{asFooter}</DialogActions>
            ) : null}
        </Dialog>
    );
}
