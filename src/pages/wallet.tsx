import { AuthGuard } from '@components/authentication/auth-guard';
import { MainLayout } from '@components/common/layouts/main-layout';
import { Column, Row } from '@components/common/flex/index';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SettingsIcon from '@mui/icons-material/Settings';
import { useEffect, useState } from 'react';
import { generateMnemonic } from 'bip39';
import React from 'react';
import { DRAWER_ID } from '@constants/common';
import { Drawer } from '@components/common/drawer';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { ToggleTabs } from '@components/common/toggle-tabs';
import { Spending } from '@components/my-wallet/spending';
import { Wallet } from '@components/my-wallet/wallet';
import { SettingDrawer } from '@components/setting/setting-main';
import { useTheme } from '@emotion/react';
import { TRIconButton } from '@components/common/buttons/icon-button';
import { doEither, sendToNative } from '@utils/native';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { NATIVE_EVENT } from '@constants/native-event';

const WalletAndSpending = () => {
    const theme = useTheme();
    const drawerDispatch = useDrawerDispatch();
    const router = useTracksRouter();

    const handleGoBackClick = () => {
        doEither(
            () => {
                router.back();
            },
            () => {
                sendToNative({ name: NATIVE_EVENT.BACK });
            }
        );
    };

    const handleSettingMywalletSideBarOpen = () => {
        drawerDispatch.open(DRAWER_ID.SETTING_MAIN);
    };

    return (
        <Column justifyContent="flex-start" sx={{ pb: 4, overflowY: 'auto', height: '100%', overflowX: 'hidden' }}>
            <ToggleTabs
                titles={['spending', 'wallet']}
                gap={3}
                isFixed
                style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    color: theme.palette.light.main,
                }}
                asStartIcon={
                    <TRIconButton
                        color="light"
                        variant="none"
                        onClick={handleGoBackClick}
                        sizing="lg"
                        asIcon={<ChevronLeftIcon style={{ color: theme.palette.light.main }} />}
                    />
                }
                asLastIcon={
                    <TRIconButton
                        color="light"
                        variant="none"
                        onClick={handleSettingMywalletSideBarOpen}
                        sizing="lg"
                        asIcon={<SettingsIcon style={{ color: theme.palette.light.main }} />}
                    />
                }
                initValue="spending"
            >
                <ToggleTabs.Contents match="spending">
                    <Spending />
                </ToggleTabs.Contents>
                <ToggleTabs.Contents match="wallet">
                    <Wallet />
                </ToggleTabs.Contents>
            </ToggleTabs>
            <SettingDrawer />
        </Column>
    );
};
WalletAndSpending.getLayout = (page: React.ReactElement) => (
    <AuthGuard>
        <MainLayout asFooter={<div />} paddingBottomOff>
            {page}
        </MainLayout>
    </AuthGuard>
);
export default WalletAndSpending;
