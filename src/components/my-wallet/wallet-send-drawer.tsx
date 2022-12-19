import React, { useState } from 'react';
import { DRAWER_ID } from '@constants/common';
import { Drawer } from '@components/common/drawer';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { Column, Row } from '@components/common/flex';
import { useTheme } from '@emotion/react';
import { TRLabel } from '@components/common/labels/label';
import { Close } from '@mui/icons-material';
import Image from 'next/image';
import { TRButton } from '@components/common/buttons/button';
import { TRInput } from '@components/common/inputs/input';
import confirm from '@components/common/modals/confirm';
import { HeaderDrawer } from '@components/common/header-drawer';
import { useGetGasFee, useSendTransferNFTTransaction } from 'src/react-query/wallet';
import { DrawerCheckPasscode } from '@components/common/drawer-check-passcode';
import { useMessageDispatch } from 'src/recoil/message';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';

interface Props {
    item: any;
}

export const WalletSend = (props: Props) => {
    const { item } = props;
    const getGasFee = useGetGasFee();
    const drawerDispatch = useDrawerDispatch();
    const theme = useTheme();
    const [address, setAddress] = useState('');
    const sendNFT = useSendTransferNFTTransaction();
    const { message } = useMessageDispatch();

    const handleClose = () => {
        drawerDispatch.close(DRAWER_ID.WALLET_SEND);
    };
    const handlecheckAddress = (e: any) => {
        setAddress(e.target.value);
    };
    const handleOpenWalletSecure = () => {
        drawerDispatch.open(DRAWER_ID.CHECK_PASSCODE);
    };
    const handleSendNFT = () => {
        sendNFT.mutate(
            {
                toAddress: address,
                nftId: item?.id,
                contract: item?.contract,
            },
            {
                onSuccess(data) {
                    drawerDispatch.closeAll();
                    message.success('Transaction Completed');
                },
                onError(error) {
                    message.error('error');
                },
            }
        );
    };

    const handleConfirmSendOpen = () => {
        getGasFee.mutate(
            {
                toAddress: address,
                nftId: item?.id,
                contract: item?.contract,
            },
            {
                onSuccess(data) {
                    confirm({
                        title: 'Confirm Transfer',
                        okText: 'Confirm',
                        handleOkClick: handleOpenWalletSecure,
                        content: (
                            <Column gap="12px">
                                <TRLabel style={{ width: '100%' }}>
                                    <Row justifyContent="space-between" style={{ width: '100%' }}>
                                        <div>Fee</div>
                                        <div>{data} BNB</div>
                                    </Row>
                                </TRLabel>
                                <TRLabel style={{ width: '100%' }}>
                                    <Row
                                        justifyContent="space-between"
                                        style={{ width: '100%' }}
                                        gap="8px"
                                        alignItems="flex-start"
                                    >
                                        <div style={{ whiteSpace: 'nowrap' }}>To Address</div>
                                        <TRLabel
                                            sizing="sm"
                                            color={theme.palette.text.secondary}
                                            style={{ wordBreak: 'break-all', width: '200px' }}
                                        >
                                            {address}
                                        </TRLabel>
                                    </Row>
                                </TRLabel>
                            </Column>
                        ),
                    });
                },
            }
        );
    };

    return (
        <Drawer
            from="right"
            drawerID={DRAWER_ID.WALLET_SEND}
            widthPercent={100}
            heightPercent={100}
            onClose={handleClose}
        >
            <DrawerLayout>
                {item ? (
                    <Column width="100%" height="100%">
                        <HeaderDrawer title="Send" asRightIcon={<Close onClick={handleClose} />} />
                        <Column gap="40px" width="100%" height="100%" justifyContent="flex-start">
                            <Column gap="16px">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={180}
                                    height={180}
                                    style={{ borderRadius: '100%' }}
                                />
                                <TRLabel sizing="sm" weight="bold" color={theme.palette.text.secondary}>
                                    # {item?.id}
                                </TRLabel>
                            </Column>
                            <Column gap="8px" alignItems="flex-start" style={{ width: '100%' }}>
                                <TRLabel
                                    sizing="md"
                                    style={{ display: 'flex', textAlign: 'center' }}
                                    color={theme.palette.text.secondary}
                                >
                                    To Address
                                </TRLabel>
                                <TRInput
                                    onChange={handlecheckAddress}
                                    errors={
                                        address.length === 42 || address.length === 0
                                            ? { message: '' }
                                            : { message: 'Please put the right address down.' }
                                    }
                                    value={address}
                                    inputStyle={{ width: '100%' }}
                                />
                            </Column>
                        </Column>
                        <TRButton
                            data-test-id="submit-activation-code"
                            onClick={handleConfirmSendOpen}
                            style={{
                                width: '100%',
                                height: '56px',
                                padding: '16px',
                                marginBottom: '16px',
                            }}
                            type="submit"
                        >
                            Confirm Transfer
                        </TRButton>
                    </Column>
                ) : (
                    <></>
                )}
            </DrawerLayout>
            <DrawerCheckPasscode title="Secure Wallet" handleSuccess={handleSendNFT} />
        </Drawer>
    );
};
