import React from 'react';
import styled from '@emotion/styled';
import { Column } from '@components/common/flex';
import { Button } from '@mui/material';
import { DRAWER_ID } from '@constants/common';
import { Drawer } from '@components/common/drawer';
import { useDrawerDispatch } from 'src/recoil/drawer';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { BackupSeedPhrase } from './backup-seed-phrase';
import { HeaderDrawer } from '@components/common/header-drawer';
import { Close } from '@mui/icons-material';
import { TRButton } from '@components/common/buttons/button';
import { TRLabel } from '@components/common/labels/label';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';

export function BackupGetAgree() {
    const drawerDispatch = useDrawerDispatch();
    const handleCloseButton = () => {
        drawerDispatch.close(DRAWER_ID.BACKUP_GET_AGREE);
        drawerDispatch.close(DRAWER_ID.CHECK_PASSCODE);
    };
    const handleOpenButton = () => {
        drawerDispatch.open(DRAWER_ID.BACKUP_SEED_PHRASE);
    };

    return (
        <Drawer
            from="right"
            drawerID={DRAWER_ID.BACKUP_GET_AGREE}
            widthPercent={100}
            heightPercent={100}
            onClose={handleCloseButton}
        >
            <DrawerLayout isNoBottomBar>
                <Column height="100%" width="100%">
                    <HeaderDrawer
                        asRightIcon={<Close onClick={handleCloseButton} sx={{ fill: 'white' }} />}
                        title="Are you being watched?"
                    />
                    <TRLabel
                        sizing="sm"
                        color="light"
                        style={{ lineHeight: '160%', textAlign: 'center', height: '100%' }}
                    >
                        Never share your Seed Phrase!
                        <br /> Anyone who has it can access your funds
                        <br /> from anywhere.
                    </TRLabel>
                    <TRButton
                        data-test-id="submit-activation-code"
                        onClick={handleOpenButton}
                        style={{ width: '100%', height: '56px', padding: '16px', marginBottom: '16px' }}
                        type="submit"
                    >
                        View Seed Phrase
                    </TRButton>
                </Column>
            </DrawerLayout>
            <BackupSeedPhrase />
        </Drawer>
    );
}
