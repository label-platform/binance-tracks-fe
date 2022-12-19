import { DRAWER_ID } from '@constants/common';
import { Drawer } from '@components/common/drawer';
import { useDrawerDispatch } from 'src/recoil/drawer';
import React from 'react';
import { Column, Row } from '@components/common/flex/index';
import styled from '@emotion/styled';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';
import { SettingDrawer } from '@components/setting/setting-main';
import { useTheme } from '@emotion/react';
import { TRIconButton } from '@components/common/buttons/icon-button';
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import { ToExternalDrawer } from '@components/my-wallet/wallet-to-external-drawer';
import { TransactionRecord } from '@components/common/transaction-record';
import Image from 'next/image';
import { TRLabel } from '@components/common/labels/label';
import { HeaderDrawer } from '@components/common/header-drawer';

interface Props {
    id: string;
    token: number;
}

const TokenInfoCard = styled(Column)`
    margin-top: 32px;
    font-family: 'Gilroy-bold';
    font-size: 32px;
    gap: 4px;
`;
const WalletFunctionContainer = styled(Row)`
    width: 100%;
    height: 68px;
    gap: 24px;
    margin-top: 32px;
    margin-bottom: 28px;
`;

export const TokenHistory = (props: Props) => {
    const theme = useTheme();
    const { id, token } = props;
    const drawerDispatch = useDrawerDispatch();

    const handleClose = () => {
        drawerDispatch.close(DRAWER_ID.TOKEN_HISTORY);
    };
    const handleSettingMywalletSideBarOpen = () => {
        drawerDispatch.open(DRAWER_ID.SETTING_MAIN);
    };
    const handleSpendingWalletReceiveOpen = () => {
        drawerDispatch.open(DRAWER_ID.SPENDING_WALLET_RECEIVE_BOTTOM_DRAWER);
    };

    const handleToExternalDrawerOpen = () => {
        drawerDispatch.open(DRAWER_ID.TO_EXTERNAL_DRAWER);
    };

    const handleSpendingWalletTradeSideBarOpen = () => {
        drawerDispatch.open(DRAWER_ID.WALLET_TRADE);
    };
    const handleTransferWalletSideBarOpenClick = () => {
        drawerDispatch.open(DRAWER_ID.TO_EXTERNAL_DRAWER);
    };

    return (
        <Drawer
            from="right"
            drawerID={DRAWER_ID.TOKEN_HISTORY}
            widthPercent={100}
            heightPercent={50}
            onClose={handleClose}
        >
            <HeaderDrawer
                title={id}
                asRightIcon={
                    <IconButton onClick={handleSettingMywalletSideBarOpen}>
                        <SettingsIcon style={{ color: theme.palette.light.main }} />
                    </IconButton>
                }
                asLeftIcon={
                    <IconButton onClick={handleClose}>
                        <ChevronLeftIcon style={{ color: theme.palette.light.main }} />
                    </IconButton>
                }
            />

            <TokenInfoCard>
                <Image src={`/images/${id}-symbol.png`} alt={id} width={42} height={42} />
                <Row gap="3px">
                    <div>123</div> <div>{id}</div>
                </Row>
            </TokenInfoCard>
            <WalletFunctionContainer>
                <Column style={{ gap: '8px', width: '56px', height: '68px' }}>
                    <TRIconButton
                        onClick={handleSpendingWalletReceiveOpen}
                        sizing="lg"
                        variant="contained"
                        asIcon={<VerticalAlignBottomOutlinedIcon sx={{ fill: 'white' }} />}
                    />
                    <TRLabel
                        sizing="xxs"
                        style={{ display: 'flex', textAlign: 'center' }}
                        color={theme.palette.text.secondary}
                    >
                        Add <br /> Funds
                    </TRLabel>
                </Column>
                <Column style={{ gap: '8px', width: '56px', height: '68px' }}>
                    <TRIconButton
                        onClick={handleToExternalDrawerOpen}
                        sizing="lg"
                        variant="contained"
                        asIcon={<LoopOutlinedIcon sx={{ fill: 'white' }} />}
                    />
                    <TRLabel
                        sizing="xxs"
                        style={{ display: 'flex', textAlign: 'center' }}
                        color={theme.palette.text.secondary}
                    >
                        Transger to Spending
                    </TRLabel>
                </Column>
                <Column style={{ gap: '8px', width: '56px', height: '68px' }}>
                    <TRIconButton
                        onClick={handleTransferWalletSideBarOpenClick}
                        sizing="lg"
                        variant="contained"
                        asIcon={<CallMadeOutlinedIcon sx={{ fill: 'white' }} />}
                    />
                    <TRLabel
                        sizing="xxs"
                        style={{ display: 'flex', textAlign: 'center' }}
                        color={theme.palette.text.secondary}
                    >
                        Transger to External
                    </TRLabel>
                </Column>
                <Column style={{ gap: '8px', width: '56px', height: '68px' }}>
                    <TRIconButton
                        onClick={handleSpendingWalletTradeSideBarOpen}
                        sizing="lg"
                        variant="contained"
                        asIcon={<RepeatOutlinedIcon sx={{ fill: 'white' }} />}
                    />
                    <TRLabel
                        sizing="xxs"
                        style={{ display: 'flex', textAlign: 'center' }}
                        color={theme.palette.text.secondary}
                    >
                        Trade Assets
                    </TRLabel>
                </Column>
            </WalletFunctionContainer>
            <Column gap="12px">
                {/* <TransactionRecord
                    state={'Confirm'}
                    amountOfCoin={'24'}
                    date={'Jul 24th 2022, 00:00'}
                    walletAddress={'0x0052feD6160f6b94604a66D2B5FBCcF2Bc4f36b1'}
                />
                <TransactionRecord
                    state={'Confirm'}
                    amountOfCoin={'-4'}
                    date={'Jul 24th 2022, 00:00'}
                    walletAddress={'0x0052feD6160f6b94604a66D2B5FBCcF2Bc4f36b1'}
                />
                <TransactionRecord
                    state={'Confirm'}
                    amountOfCoin={'324'}
                    date={'Jul 24th 2022, 00:00'}
                    walletAddress={'0x0052feD6160f6b94604a66D2B5FBCcF2Bc4f36b1'}
                />
                <TransactionRecord
                    state={'Confirm'}
                    amountOfCoin={'14'}
                    date={'Jul 24th 2022, 00:00'}
                    walletAddress={'0x0052feD6160f6b94604a66D2B5FBCcF2Bc4f36b1'}
                />
                <TransactionRecord
                    state={'Confirm'}
                    amountOfCoin={'-324'}
                    date={'Jul 24th 2022, 00:00'}
                    walletAddress={'0x0052feD6160f6b94604a66D2B5FBCcF2Bc4f36b1'}
                />
                <TransactionRecord
                    state={'Confirm'}
                    amountOfCoin={'-24'}
                    date={'Jul 24th 2022, 00:00'}
                    walletAddress={'0x0052feD6160f6b94604a66D2B5FBCcF2Bc4f36b1'}
                /> */}
            </Column>
            <SettingDrawer />
            {/* <ToExternalDrawer id={id} token={token} /> */}
        </Drawer>
    );
};
