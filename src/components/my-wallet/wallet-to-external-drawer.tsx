import React, { useState } from 'react';
import { DRAWER_ID } from '@constants/common';
import { Drawer } from '@components/common/drawer';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { Column, Row } from '@components/common/flex/index';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { TRInput } from '@components/common/inputs/input';
import { InputWithAdorments } from '@components/common/inputs/input-with-adorments';
import { TRLabel } from '@components/common/labels/label';
import { TRButton } from '@components/common/buttons/button';
import confirm from '@components/common/modals/confirm';
import { useMessageDispatch } from 'src/recoil/message';
import { useSendTransferTokenTransaction } from 'src/react-query/wallet';
import Image from 'next/image';
import { ChevronLeft, Close } from '@mui/icons-material';
import { HeaderDrawer } from '@components/common/header-drawer';
import { TokenInfos, getWeb3Instance, getContract } from '@constants/jsonInterface/web3';
import { ContractGuard } from '@services/wallet/wallet';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';

interface Props {
    id: ContractGuard;
    token: number;
}

const Contents = styled(Column)`
    justify-content: flex-start;
    width: 100%;
    height: 100%;
`;

const ToAddress = styled(Column)`
    gap: 8px;
    width: 100%;
    align-items: flex-start;
    margin-bottom: 32px;
`;

const Amount = styled(Column)`
    gap: 8px;
    width: 100%;
    align-items: flex-start;
`;

export const ToExternalDrawer = (props: Props) => {
    const { id, token } = props;
    const { message } = useMessageDispatch();
    const theme = useTheme();
    const drawerDispatch = useDrawerDispatch();
    const [address, setAddress] = useState('');
    const [amountOfToken, setAmountOfToken] = useState(0);
    const sendTransferToken = useSendTransferTokenTransaction();

    const handleClose = () => {
        drawerDispatch.close(DRAWER_ID.TO_EXTERNAL_DRAWER);
        setAddress('');
        setAmountOfToken(0);
    };

    const handlecheckAddress = (e: any) => {
        setAddress(e.target.value);
    };
    const handleAmountOfToken = (e: any) => {
        setAmountOfToken(e.target.value);
    };
    const handleMaxAmount = () => {
        setAmountOfToken(token);
    };

    const handleConfirmSendToken = async () => {
        sendTransferToken.mutate(
            {
                contract: id,
                toAddress: address,
                amount: String(amountOfToken),
            },
            {
                onSuccess(data) {
                    message.success('Your transaction has been submitted. Please check the result on the blockchain.');
                    handleClose();
                },
                onError(error) {
                    message.error('error');
                },
            }
        );
    };

    const handleConfrimToExternalOpenClick = () => {
        confirm({
            title: 'Confirm Transfer',
            okText: 'Confirm',
            handleOkClick: handleConfirmSendToken,
            content: (
                <Column gap="12px">
                    <TRLabel style={{ width: '100%' }}>
                        <Row justifyContent="space-between" style={{ width: '100%' }}>
                            <div>Fee</div>
                            <div>{amountOfToken * 0.001} BNB</div>
                        </Row>
                    </TRLabel>
                    <TRLabel style={{ width: '100%' }}>
                        <Row justifyContent="space-between" style={{ width: '100%' }}>
                            <div>Will send</div>
                            <div>
                                {amountOfToken} {id}
                            </div>
                        </Row>
                    </TRLabel>
                    <TRLabel style={{ width: '100%' }}>
                        <Row justifyContent="space-between" style={{ width: '100%' }} gap="8px" alignItems="flex-start">
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
    };
    return (
        <Drawer
            from="right"
            drawerID={DRAWER_ID.TO_EXTERNAL_DRAWER}
            widthPercent={100}
            heightPercent={100}
            onClose={handleClose}
        >
            <DrawerLayout isNoBottomBar>
                <Column width="100%" height="100%">
                    <HeaderDrawer
                        asLeftIcon={<ChevronLeft onClick={handleClose} sx={{ fill: 'white' }} />}
                        title="Transfer to External"
                    />
                    <Contents>
                        <ToAddress>
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
                        </ToAddress>
                        <Amount>
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
                                Available: {token} {id}
                            </TRLabel>
                            <Row justifyContent="space-evenly" style={{ width: '100%', position: 'relative' }}>
                                <InputWithAdorments
                                    type="number"
                                    onChange={handleAmountOfToken}
                                    inputStyle={{ width: '78%' }}
                                    value={amountOfToken}
                                    errors={
                                        Number(amountOfToken) > token
                                            ? { message: 'Not enough amount.' }
                                            : { message: '' }
                                    }
                                    asEnd={
                                        <TRLabel weight="bold" color="primary" sizing="sm" onClick={handleMaxAmount}>
                                            MAX
                                        </TRLabel>
                                    }
                                />
                                <Row
                                    gap="4px"
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '16px',
                                        fontFamily: 'Gilroy-bold',
                                        fontSize: '16px',
                                    }}
                                >
                                    <Image src={`/images/${id}-symbol.png`} alt={id} width={24} height={24} />
                                    <span>{id}</span>
                                </Row>
                            </Row>
                        </Amount>
                    </Contents>
                    <TRButton
                        data-test-id="submit-activation-code"
                        onClick={handleConfrimToExternalOpenClick}
                        style={{ width: '100%', height: '56px', padding: '16px', marginBottom: '16px' }}
                        type="submit"
                    >
                        Confirm Transfer
                    </TRButton>
                </Column>
            </DrawerLayout>
        </Drawer>
    );
};
