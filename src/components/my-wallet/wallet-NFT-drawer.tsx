import React, { useState } from 'react';
import { DRAWER_ID } from '@constants/common';
import { Drawer } from '@components/common/drawer';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { Column, Row } from '@components/common/flex';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { TRLabel } from '@components/common/labels/label';
import { ChevronLeft, Close } from '@mui/icons-material';
import { Headphone } from '@models/headphone/headphone';
import { HeadphoneBox } from '@models/headphone-box/headphone-box';
import { Item } from '@models/item/item';
import Image from 'next/image';
import { TRButton } from '@components/common/buttons/button';
import { WalletSend } from './wallet-send-drawer';
import confirm from '@components/common/modals/confirm';
import { useMessageDispatch } from 'src/recoil/message';
import { HeaderDrawer } from '@components/common/header-drawer';
import { useGetGasFeeToSpending, useSendTransferNFTToSpending } from 'src/react-query/wallet';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';

interface Props {
    item: any;
}

const PropertiesBox = styled(Column)`
    gap: 8px;
    width: 176px;
    height: 61px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 6px;
`;

export const WalletNFT = (props: Props) => {
    const { item } = props;
    const getGasFeeToSpending = useGetGasFeeToSpending();
    const sendNFTToSpending = useSendTransferNFTToSpending();
    const { message } = useMessageDispatch();
    const drawerDispatch = useDrawerDispatch();
    const theme = useTheme();
    const [selectItem, setSelectItem] = useState<any>();
    const handleClose = () => {
        drawerDispatch.close(DRAWER_ID.WALLET_NFT);
    };
    const handleSend = (item: any) => {
        setSelectItem(item);
        drawerDispatch.open(DRAWER_ID.WALLET_SEND);
    };
    const handleConfirmSend = () => {
        sendNFTToSpending.mutate(
            {
                contract: item.contract,
                nftId: item.id,
            },
            {
                onSuccess() {
                    drawerDispatch.closeAll();
                    message.success('Transaction Submitted. It may take 2-5 minutes to accomplish.');
                },
            }
        );
    };

    const handleConfrimInventoryOpenClick = () => {
        getGasFeeToSpending.mutate(
            {
                contract: item.contract,
                nftId: item.id,
            },
            {
                onSuccess(data) {
                    confirm({
                        title: 'Confirm Transfer',
                        okText: 'Confirm',
                        handleOkClick: handleConfirmSend,
                        content: (
                            <Column gap="12px">
                                <Row
                                    justifyContent="space-between"
                                    style={{
                                        width: '100%',
                                        marginTop: '20px',
                                        borderBottom: `1px solid ${theme.palette.text.secondary}`,
                                        paddingBottom: '20px',
                                        marginBottom: '8px',
                                    }}
                                >
                                    <Row gap="8px" justifyContent="flex-start" style={{ width: '100%' }}>
                                        <TRLabel>From</TRLabel>
                                        <TRLabel weight="bold">Wallet</TRLabel>
                                    </Row>
                                    <Row gap="8px" justifyContent="flex-end" style={{ width: '100%' }}>
                                        <TRLabel>To</TRLabel>
                                        <TRLabel weight="bold">Inventory</TRLabel>
                                    </Row>
                                </Row>
                                <Row justifyContent="space-between" style={{ width: '100%' }}>
                                    <TRLabel>Fee</TRLabel>
                                    <Row>
                                        <TRLabel weight="bold">{data}</TRLabel>
                                        <TRLabel> BNB</TRLabel>
                                    </Row>
                                </Row>
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
            drawerID={DRAWER_ID.WALLET_NFT}
            widthPercent={100}
            heightPercent={100}
            onClose={handleClose}
        >
            <DrawerLayout isNoBottomBar>
                {item ? (
                    <Column width="100%">
                        <HeaderDrawer
                            asRightIcon={<Close onClick={handleClose} sx={{ fill: 'white' }} />}
                            title={`# ${item?.name.split('#')[1]}`}
                        />
                        <Column gap="40px" width="100%">
                            <Column gap="32px" width="100%">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={180}
                                    height={180}
                                    style={{ borderRadius: '100%' }}
                                />
                                <Row gap="16px" width="100%">
                                    <TRButton
                                        data-test-id="submit-activation-code"
                                        onClick={() => handleSend(item)}
                                        sizing="md"
                                        type="submit"
                                        style={{ width: '100%' }}
                                    >
                                        Send
                                    </TRButton>
                                    <TRButton
                                        data-test-id="submit-activation-code"
                                        onClick={handleConfrimInventoryOpenClick}
                                        sizing="md"
                                        type="submit"
                                        variant="outlined"
                                        style={{ width: '100%' }}
                                    >
                                        To Inventory
                                    </TRButton>
                                </Row>
                            </Column>
                            <Column gap="28px" width="100%" style={{ paddingBottom: '50px' }}>
                                <Column gap="8px" alignItems="flex-start">
                                    <TRLabel sizing="lg" weight="bold">
                                        Description
                                    </TRLabel>
                                    <TRLabel sizing="sm" color={theme.palette.text.secondary}>
                                        {item.description}
                                    </TRLabel>
                                </Column>
                                <Column gap="8px" alignItems="flex-start" width="100%">
                                    <TRLabel sizing="lg" weight="bold">
                                        Properties
                                    </TRLabel>
                                    <Row
                                        style={{
                                            width: '100%',
                                        }}
                                    >
                                        <Row
                                            style={{
                                                width: '100%',
                                                flexWrap: 'wrap',
                                                gap: '8px',
                                                justifyContent: 'flex-start',
                                            }}
                                        >
                                            {item.attributes.map((value, index) => (
                                                <PropertiesBox key={index}>
                                                    <TRLabel sizing="xs" weight="bold" style={{ textAlign: 'center' }}>
                                                        {value.trait_type}
                                                    </TRLabel>
                                                    <TRLabel sizing="xs">{value.value}</TRLabel>
                                                </PropertiesBox>
                                            ))}
                                        </Row>
                                    </Row>
                                </Column>
                            </Column>
                        </Column>
                    </Column>
                ) : (
                    <></>
                )}
            </DrawerLayout>
            <WalletSend item={selectItem} />
        </Drawer>
    );
};
