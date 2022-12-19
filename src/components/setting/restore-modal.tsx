import React from 'react';
import { Modal } from '@components/common/modals/modal';
import { MODAL_ID } from '@constants/common';
import { Row } from '@components/common/flex';
import CloseIcon from '@mui/icons-material/Close';
import { useModalDispatch } from 'src/recoil/modal';
import { DRAWER_ID } from '@constants/common';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { TRButton } from '@components/common/buttons/button';
import { TRLabel } from '@components/common/labels/label';
import { useTheme } from '@emotion/react';
import { RestoreConfirm } from './restore-wallet-confirm';
export function RestoreModal() {
    const modalDispatch = useModalDispatch();
    const { open } = useDrawerDispatch();
    const theme = useTheme();

    const handleRestoreSettingNextStepClick = () => {
        modalDispatch.close(MODAL_ID.RESTORE_MODAL);
        open(DRAWER_ID.RESTORE_WALLET_CONFIRM);
    };

    return (
        <>
            <Modal
                modalID={MODAL_ID.RESTORE_MODAL}
                asTitle="Google Authenticator"
                asCloseIcon={<CloseIcon sx={{ fill: 'black !important' }} />}
                asFooter={
                    <Row style={{ width: '100%' }}>
                        <TRButton style={{ width: '100%' }} sizing="md" onClick={handleRestoreSettingNextStepClick}>
                            <TRLabel sizing="sm" weight="bold">
                                GO TO SETTINGS
                            </TRLabel>
                        </TRButton>
                    </Row>
                }
            >
                <Row style={{ padding: '24px 0px', textAlign: 'center' }}>
                    <TRLabel style={{ color: theme.palette.text.secondary }}>
                        You must have Google <br />
                        Authentication turned on in <br />
                        order to perform this action
                    </TRLabel>
                </Row>
            </Modal>
            <RestoreConfirm title="Restore Wallet" />
        </>
    );
}
