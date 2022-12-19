import React from 'react';
import { DRAWER_ID } from '@constants/common';
import { Drawer } from '@components/common/drawer';
import { useDrawerDispatch } from 'src/recoil/drawer';
import styled from '@emotion/styled';
import { Column, Row, FlexItem } from '@components/common/flex/index';
import { useTheme } from '@emotion/react';
import { TRLabel } from '@components/common/labels/label';
import { ChevronLeft, Close, ContentCopy } from '@mui/icons-material';
import { Tabs } from '@components/common/tabs';
import { InputWithAdorments } from '@components/common/inputs/input-with-adorments';
import QRCode from 'react-qr-code';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { HeaderDrawer } from '@components/common/header-drawer';
import { useUserSelfInfoQuery } from 'src/react-query/user';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';
import { useClipboard } from '@hooks/use-clipboard';

const WalletTabTitles = styled(Tabs.Titles)`
    gap: 10px;
    width: 100%;
    color: white;
    position: sticky;
    background-color: ${(props) => props.theme.palette.dark.main};
    top: 65px;
    z-index: 3;
    margin-bottom: 40px;
    & > div {
        text-align: center;
        padding-bottom: 5px;
        &.active {
            border-bottom: 2px solid white;
        }
    }
`;
const CopyWalletInput = styled(InputWithAdorments)`
    & > input {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
        color: 'rgba(252, 252, 252, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
        right: '20px',
    },
}));

export const AddFunds = () => {
    const drawerDispatch = useDrawerDispatch();
    const theme = useTheme();
    const { write } = useClipboard();
    const { user, isLoading: isUserLoading } = useUserSelfInfoQuery();

    const handleClose = () => {
        drawerDispatch.close(DRAWER_ID.ADD_FUNDS);
    };
    const copyData = () => {
        write(user.walletAddress);
    };

    if (isUserLoading) {
        return null;
    }

    return (
        <Drawer
            from="right"
            drawerID={DRAWER_ID.ADD_FUNDS}
            widthPercent={100}
            heightPercent={100}
            onClose={handleClose}
        >
            <DrawerLayout isNoBottomBar>
                <Column width="100%">
                    <HeaderDrawer
                        asLeftIcon={<ChevronLeft onClick={handleClose} sx={{ fill: 'white' }} />}
                        title="Add Funds"
                    />

                    <Tabs style={{ width: '100%', height: '100%' }}>
                        <WalletTabTitles>
                            <FlexItem style={{ maxWidth: '100%' }}>Receive</FlexItem>
                            <FlexItem style={{ maxWidth: '100%' }}>Buy BNB With Card</FlexItem>
                        </WalletTabTitles>
                        <Tabs.Panels style={{ width: '100%', position: 'relative', height: '100%' }}>
                            <Column gap="40px" width="100%">
                                <Column style={{ width: '120px' }}>
                                    <QRCode value={user.walletAddress} size={100} bgColor="#000000" fgColor="#FFFFFF" />
                                </Column>
                                <Column gap="24px" width="100%">
                                    <TRLabel
                                        sizing="sm"
                                        style={{ textAlign: 'center' }}
                                        color={theme.palette.text.secondary}
                                    >
                                        Fransfer funds from an Exchange
                                        <br /> or another wallet to your wallet address below
                                    </TRLabel>
                                    <CopyWalletInput
                                        inputStyle={{
                                            width: '100%',
                                            fontSize: '16px',
                                        }}
                                        value={user.walletAddress}
                                        onClick={copyData}
                                        disabled
                                        asEnd={
                                            <LightTooltip title="Copied" placement="left" enterTouchDelay={0}>
                                                <ContentCopy
                                                    sx={{
                                                        fill: theme.palette.primary.main,
                                                    }}
                                                />
                                            </LightTooltip>
                                        }
                                    />
                                    <TRLabel
                                        sizing="sm"
                                        style={{ textAlign: 'center' }}
                                        color={theme.palette.text.secondary}
                                    >
                                        Only send BNB or any other ERC - 20 token
                                        <br /> to this address.
                                    </TRLabel>
                                </Column>
                            </Column>
                            <Column gap="40px">
                                <Column style={{ height: '120px' }}></Column>
                            </Column>
                        </Tabs.Panels>
                    </Tabs>
                </Column>
            </DrawerLayout>
        </Drawer>
    );
};
