import { MainNavBar } from 'src/components/main/main-nav-bar';
import { Breakpoint, Container } from '@mui/material';
import { NavBarBottom } from '../nav-bar-bottom';
import { MainNavBarBottom } from '@components/main/main-nav-bar-bottom';
import { sendToNative, useIsOnNative, useListenNativeEvent } from '@utils/native';
import { LISTEN_EVENT, NATIVE_EVENT } from '@constants/native-event';
import { ModalManageHeadphone } from '../modal-manage-headphone';
import { useModalDispatch, useModalIsOpened, useModalState } from 'src/recoil/modal';
import { MODAL_ID } from '@constants/common';
import { HistoryManagerSingleTon } from '@services/history';
import { useTracksRouter } from '@hooks/use-tracks-router';
import React, { useEffect, useMemo } from 'react';
import { useWindowSize } from 'react-use';
import { isModalConfirmOpen, unmountContainerAll } from '../modals/confirm';
import { useDrawerDispatch, useDrawerCountIsOpend } from 'src/recoil/drawer';
import { ModalSetUpWallet } from '../modal-setup-wallet';
import { useGetPrivateKey } from '@hooks/use-get-private-key';
import { WalletSingleTon } from '@services/wallet/wallet';
import { useUserSelfInfoQuery } from 'src/react-query/user';
import { useIsMiniPlayerOn } from '@hooks/use-is-miniplayer-on';

interface MainLayoutProps {
    children: React.ReactElement;
    asFooter?: React.ReactNode;
    paddingBottomOff?: boolean;
    maxWidth?: Breakpoint;
}

const historyInstance = HistoryManagerSingleTon.getInstance();
const TOOLBAR_HEIGHT = 50;
const SPARE_PADDING = 20;
const MINI_PLAYER_HEIGHT = 56;

export const MainLayout = ({ children, asFooter, paddingBottomOff, maxWidth = 'sm' }: MainLayoutProps) => {
    const isNative = useIsOnNative();
    const router = useTracksRouter();
    const modalDispatch = useModalDispatch();

    const isMiniPlayerOn = useIsMiniPlayerOn();
    const { visible: manageHeadphoneVisible } = useModalState(MODAL_ID.MANAGE_HEADPHONE_MODAL);
    const { visible: setUpWalletVisible } = useModalState(MODAL_ID.SET_UP_WALLET_MODAL);
    const modalIsOpened = useModalIsOpened();
    const drawerCount = useDrawerCountIsOpend();
    const { closeSequencially } = useDrawerDispatch();
    const { height } = useWindowSize();
    const pk = useGetPrivateKey();
    const { user } = useUserSelfInfoQuery();

    useEffect(() => {
        if (!user.hasWalletAddress) return;

        WalletSingleTon.getInstance().init(user.walletAddress, pk, user.id);
    }, [pk, user?.walletAddress]);

    const { paddingTop, paddingBottom } = useMemo(() => {
        if (isMiniPlayerOn && isNative) {
            return {
                paddingBottom: 20 + MINI_PLAYER_HEIGHT,
                paddingTop: 20,
            };
        }

        if (isNative) {
            return {
                paddingBottom: 20,
                paddingTop: 20,
            };
        }
        return {
            paddingBottom: TOOLBAR_HEIGHT,
            paddingTop: TOOLBAR_HEIGHT + SPARE_PADDING,
        };
    }, [isNative, isMiniPlayerOn]);

    useListenNativeEvent(
        ({ data }) => {
            switch (data.type) {
                case LISTEN_EVENT.BACK: {
                    if (modalIsOpened) {
                        modalDispatch.closeAll();
                        return;
                    }

                    if (isModalConfirmOpen) {
                        unmountContainerAll();
                        return;
                    }

                    if (drawerCount > 0) {
                        closeSequencially();
                        return;
                    }

                    if (historyInstance.count > 0) {
                        router.back();
                        return;
                    }

                    sendToNative({
                        name: data.params.isMain ? NATIVE_EVENT.EXIT_APP : NATIVE_EVENT.BACK,
                    });

                    break;
                }
            }
        },
        [modalIsOpened, drawerCount]
    );

    useListenNativeEvent(
        ({ data }) => {
            switch (data.type) {
                case LISTEN_EVENT.MANAGE_HEADPHONE: {
                    modalDispatch.open(MODAL_ID.MANAGE_HEADPHONE_MODAL);
                    break;
                }
                case LISTEN_EVENT.SET_UP_WALLET: {
                    modalDispatch.open(MODAL_ID.SET_UP_WALLET_MODAL);
                    break;
                }
            }
        },
        [manageHeadphoneVisible, setUpWalletVisible]
    );

    return (
        <Container
            sx={{
                paddingTop: `${paddingTop}px`,
                height: `${height}px`,
                paddingBottom: `${paddingBottom}px`,
                overflowY: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                px: isNative ? '0px !important' : undefined,
            }}
            maxWidth={maxWidth}
        >
            {!isNative ? <MainNavBar height={TOOLBAR_HEIGHT} /> : null}
            {children}
            {!isNative || !!asFooter ? (
                <NavBarBottom height={paddingBottomOff && !isMiniPlayerOn ? 0 : TOOLBAR_HEIGHT}>
                    {asFooter ? asFooter : <MainNavBarBottom />}
                </NavBarBottom>
            ) : null}
            <ModalManageHeadphone />
            <ModalSetUpWallet />
        </Container>
    );
};
