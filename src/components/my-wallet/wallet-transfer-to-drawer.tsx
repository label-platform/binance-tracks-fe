import React, { useEffect, useState } from 'react';
import { DRAWER_ID } from '@constants/common';
import { Drawer } from '@components/common/drawer';
import { useDrawerDispatch, useDrawerState } from 'src/recoil/drawer';
import { Column, Row } from '@components/common/flex/index';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { InputWithAdorments } from '@components/common/inputs/input-with-adorments';
import { TRLabel } from '@components/common/labels/label';
import { TRButton } from '@components/common/buttons/button';
import confirm from '@components/common/modals/confirm';
import Image from 'next/image';
import { Close, KeyboardArrowDown } from '@mui/icons-material';
import { TRSelectModal } from '@components/common/inputs/select';
import { TRIconButton } from '@components/common/buttons/icon-button';
import { ModalGoogleAuthenticaton } from '@components/common/modal-google-authenticator';
import { useModalDispatch } from 'src/recoil/modal';
import { MODAL_ID } from '@constants/common';
import { HeaderDrawer } from '@components/common/header-drawer';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';

import {
    useGetGasFeeToSpending,
    useGetTokenBalanceOfWallet,
    useSendTokenSpendingToWallet,
    useSendTransferTokenToSpending,
} from 'src/react-query/wallet';
import { useUserBalanceQuery, useUserSelfInfoQuery } from 'src/react-query/user';
import { ContractGuard } from '@services/wallet/wallet';

interface Props {
    isSpending?: boolean;
}

const Contents = styled(Column)`
    justify-content: flex-start;
    width: 100%;
    height: 100%;
`;

const Section = styled(Column)`
    gap: 8px;
    width: 100%;
    align-items: flex-start;
    margin-bottom: 16px;
`;
const SwitchContainer = styled(Column)`
    position: relative;
    width: 100%;
    height: 120px;
    border: 1px solid rgba(255, 255, 255, 0.87);
    border-radius: 6px;
    margin-bottom: 32px;
    padding: 0px 20px;
`;
const SwitchContent = styled(Row)`
    width: 100%;
    height: 60px;
    justify-content: flex-start;
    gap: 16px;
`;

const Asset = styled(Row)`
    width: 100%;
    height: 56px;
    border: 1px solid ${(props) => props.theme.palette.primary.main};
    background-color: ${(props) => props.theme.palette.dark.main};
    border-radius: 8px;
    padding: 16px;
    justify-content: space-between;
`;

const WalletOption = ['Wallet', 'Spending'];
export const TransferTo = (props: Props) => {
    const sendWalletToSpending = useSendTransferTokenToSpending();
    const sendSpendingToWallet = useSendTokenSpendingToWallet();
    const drawerDispatch = useDrawerDispatch();
    const visible = useDrawerState(DRAWER_ID.TRANSFER_TO)
    const { tokens, refetch } = useGetTokenBalanceOfWallet(['BNB', 'LBL', 'BLB']);
    const { user } = useUserSelfInfoQuery();
    const modalDispatch = useModalDispatch();
    const getGasFeeToSpending = useGetGasFeeToSpending();
    const { isSpending } = props;
    const theme = useTheme();
    const [isWallet, setIsWallet] = useState(!isSpending);
    const [option, setOption] = useState<ContractGuard>('BNB');
    const [amountOfToken, setAmountOfToken] = useState(0);

    useEffect(() => {
        if (visible) {
            refetch();
        }
    }, [visible]);
    const tokenList = {
        BNB: {
            name: 'BNB',
            amountOfToken: !isWallet ? user.spendingBalances.BNB : tokens?.BNB,
        },
        LBL: {
            name: 'LBL',
            amountOfToken: !isWallet ? user.spendingBalances.LBL : tokens?.LBL,
        },
        BLB: {
            name: 'BLB',
            amountOfToken: !isWallet ? user.spendingBalances.BLB : tokens?.BLB,
        },
    };

    const filterOptions = [
        { label: 'BNB', value: 'BNB' },
        { label: 'LBL', value: 'LBL' },
        { label: 'BLB', value: 'BLB' },
    ];

    const handleConfrimTransferOpenClick = async () => {
        if (isWallet) {
            getGasFeeToSpending.mutate(
                {
                    amount: String(amountOfToken),
                    contract: option,
                },
                {
                    onSuccess(data) {
                        confirm({
                            title: 'Confirm Transfer',
                            okText: 'Confirm',
                            handleOkClick: handleAuthenticatorOpenClick,
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
                                            <TRLabel weight="bold">
                                                {isWallet ? WalletOption[0] : WalletOption[1]}
                                            </TRLabel>
                                        </Row>
                                        <Row gap="8px" justifyContent="flex-end" style={{ width: '100%' }}>
                                            <TRLabel>To</TRLabel>
                                            <TRLabel weight="bold">
                                                {isWallet ? WalletOption[1] : WalletOption[0]}
                                            </TRLabel>
                                        </Row>
                                    </Row>
                                    <Row justifyContent="space-between" style={{ width: '100%' }}>
                                        <TRLabel>Fee</TRLabel>
                                        <Row>
                                            <TRLabel weight="bold">{data}</TRLabel>
                                            <TRLabel> BNB</TRLabel>
                                        </Row>
                                    </Row>
                                    <Row justifyContent="space-between" style={{ width: '100%' }}>
                                        <TRLabel>Will transfer</TRLabel>
                                        <Row>
                                            <TRLabel weight="bold">{amountOfToken}</TRLabel>
                                            <TRLabel> {option}</TRLabel>
                                        </Row>
                                    </Row>
                                </Column>
                            ),
                        });
                    },
                }
            );
        } else {
            confirm({
                title: 'Confirm Transfer',
                okText: 'Confirm',
                handleOkClick: handleAuthenticatorOpenClick,
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
                                <TRLabel weight="bold">{isWallet ? WalletOption[0] : WalletOption[1]}</TRLabel>
                            </Row>
                            <Row gap="8px" justifyContent="flex-end" style={{ width: '100%' }}>
                                <TRLabel>To</TRLabel>
                                <TRLabel weight="bold">{isWallet ? WalletOption[1] : WalletOption[0]}</TRLabel>
                            </Row>
                        </Row>
                        <Row justifyContent="space-between" style={{ width: '100%' }}>
                            <TRLabel>Fee</TRLabel>
                            <Row>
                                <TRLabel weight="bold">1</TRLabel>
                                <TRLabel> BLB</TRLabel>
                            </Row>
                        </Row>
                        <Row justifyContent="space-between" style={{ width: '100%' }}>
                            <TRLabel>Will transfer</TRLabel>
                            <Row>
                                <TRLabel weight="bold">{amountOfToken}</TRLabel>
                                <TRLabel> {option}</TRLabel>
                            </Row>
                        </Row>
                    </Column>
                ),
            });
        }
    };
    const handleConfirm = () => {
        if (isWallet) {
            sendWalletToSpending.mutate(
                {
                    contract: option,
                    amount: String(amountOfToken),
                },
                {
                    onSuccess() {
                        handleClose();
                    },
                }
            );
        } else {
            sendSpendingToWallet.mutate(
                {
                    tokenSymbol: option,
                    amount: String(amountOfToken),
                    signedMessage: 'privateKey',
                },
                {
                    onSuccess() {
                        handleClose();
                    },
                }
            );
        }
    };

    const handleMaxAmount = () => {
        setAmountOfToken(tokenList[option]?.amountOfToken);
    };

    const handleAmountOfToken = (e: any) => {
        setAmountOfToken(e.target.value);
    };
    const handleClose = () => {
        setAmountOfToken(0);
        drawerDispatch.close(DRAWER_ID.TRANSFER_TO);
    };

    const handleOptionChange = (value: ContractGuard) => {
        setOption(value);
    };
    const handleAuthenticatorOpenClick = () => {
        modalDispatch.open(MODAL_ID.GOOGLE_AUTHENTICATOR_MODAL);
    };

    const ReverseWallet = () => {
        setIsWallet(!isWallet);
    };

    return (
        <Drawer
            from="right"
            drawerID={DRAWER_ID.TRANSFER_TO}
            widthPercent={100}
            heightPercent={100}
            onClose={handleClose}
        >
            <DrawerLayout isNoBottomBar>
                <Column width="100%" height="100%">
                    <HeaderDrawer asRightIcon={<Close onClick={handleClose} />} title="Transfer" />
                    <Contents>
                        <SwitchContainer>
                            <SwitchContent>
                                <TRLabel style={{ width: '37px' }}>From</TRLabel>
                                <TRLabel weight="bold">{isWallet ? WalletOption[0] : WalletOption[1]}</TRLabel>
                            </SwitchContent>
                            <SwitchContent>
                                <TRLabel style={{ width: '37px', justifyContent: 'flex-start ' }}>To</TRLabel>
                                <TRLabel weight="bold">{isWallet ? WalletOption[1] : WalletOption[0]}</TRLabel>
                            </SwitchContent>
                            <TRIconButton
                                onClick={ReverseWallet}
                                sizing="lg"
                                variant="contained"
                                style={{ position: 'absolute', right: '20px' }}
                                asIcon={
                                    <Row style={{ width: '100%', height: '100%' }}>
                                        <Image
                                            src="/images/change-symbol.png"
                                            alt="change-symbol"
                                            height={24}
                                            width={24}
                                        />
                                    </Row>
                                }
                            />
                        </SwitchContainer>
                        <Section>
                            <TRLabel
                                sizing="md"
                                style={{ display: 'flex', textAlign: 'center' }}
                                color={theme.palette.text.secondary}
                            >
                                Asset
                            </TRLabel>
                            <Asset>
                                <Row gap="4px">
                                    <Image src={`/images/${option}-symbol.png`} alt={option} width={24} height={24} />
                                    <TRLabel weight="bold">{option}</TRLabel>
                                </Row>
                                <TRSelectModal
                                    name="sort options"
                                    onChange={handleOptionChange}
                                    defaultValue={1}
                                    options={filterOptions}
                                    value={option}
                                    asTrigger={
                                        <Row>
                                            <KeyboardArrowDown />
                                        </Row>
                                    }
                                >
                                    {Object.keys(tokenList).map((value, index) => (
                                        <Row key={index} gap="8px">
                                            <Image
                                                src={`/images/${value}-symbol.png`}
                                                alt={value}
                                                width={24}
                                                height={24}
                                            />
                                            <span>{value}</span>
                                        </Row>
                                    ))}
                                </TRSelectModal>
                            </Asset>
                        </Section>
                        <Section>
                            <TRLabel
                                sizing="md"
                                style={{ display: 'flex', textAlign: 'center' }}
                                color={theme.palette.text.secondary}
                            >
                                Amount
                            </TRLabel>
                            <TRLabel
                                sizing="xs"
                                style={{ display: 'flex', textAlign: 'center' }}
                                color={theme.palette.text.secondary}
                            >
                                Available: {tokenList[option]?.amountOfToken} {option}
                            </TRLabel>
                            <Row justifyContent="space-evenly" style={{ width: '100%', position: 'relative' }}>
                                <InputWithAdorments
                                    type="number"
                                    onChange={handleAmountOfToken}
                                    inputStyle={{ width: '100%' }}
                                    value={amountOfToken}
                                    errors={
                                        Number(amountOfToken) > tokenList[option]?.amountOfToken
                                            ? { message: 'Not enough amount.' }
                                            : { message: '' }
                                    }
                                    asEnd={
                                        <TRLabel weight="bold" color="primary" sizing="sm" onClick={handleMaxAmount}>
                                            MAX
                                        </TRLabel>
                                    }
                                />
                            </Row>
                        </Section>
                    </Contents>
                    <TRButton
                        data-test-id="submit-activation-code"
                        onClick={handleConfrimTransferOpenClick}
                        style={{ width: '100%', height: '56px', padding: '16px', marginBottom: '16px' }}
                        type="submit"
                    >
                        Confirm Transfer
                    </TRButton>
                </Column>
                <ModalGoogleAuthenticaton onSuccess={handleConfirm} />
            </DrawerLayout>
        </Drawer>
    );
};
