import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import React from 'react';
import { DRAWER_ID, SECOND } from '@constants/common';
import { Drawer } from '@components/common/drawer';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { Column, Row } from '@components/common/flex/index';
import { Close, KeyboardArrowDown, Refresh } from '@mui/icons-material';
import { TRLabel } from '@components/common/labels/label';
import { InputWithAdorments } from '@components/common/inputs/input-with-adorments';
import { TRSelectModal } from '@components/common/inputs/select';
import { TRIconButton } from '@components/common/buttons/icon-button';
import Image from 'next/image';
import { useTheme } from '@emotion/react';
import { HeaderDrawer } from '@components/common/header-drawer';
import { ContractGuard, WalletSingleTon } from '@services/wallet/wallet';
import { useDebounce } from 'react-use';
interface Props {
    tokenList: any;
}

const TokenDropDown = styled(Row)`
    width: 112px !important;
    height: 56px;
    border: 1px solid ${(props) => props.theme.palette.primary.main};
    background-color: ${(props) => props.theme.palette.dark.main};
    border-radius: 8px;
    padding: 8px;
    justify-content: space-between;
`;
const Section = styled(Column)`
    gap: 8px;
    width: 312px;
    align-items: flex-start;
    margin-bottom: 16px;
`;
const filterOptions = [
    { label: 'BUSD', value: 'BUSD' },
    { label: 'BNB', value: 'BNB' },
    { label: 'LBL', value: 'LBL' },
    { label: 'BLB', value: 'BLB' },
];
const TokenList = ['BUSD', 'BNB', 'LBL', 'BLB'];

export const WalletTradeDrawer = (props: Props) => {
    const { tokenList } = props;
    const drawerDispatch = useDrawerDispatch();
    const [amountOfToken, setAmountOfToken] = useState(0);
    const [exchangedRateToken, setExchangedRateToken] = useState<any>('');
    const [optionFrom, setOptionFrom] = useState<ContractGuard>('BUSD');
    const [optionTo, setOptionTo] = useState<ContractGuard>('BUSD');

    const theme = useTheme();

    useDebounce(
        () => {
            WalletSingleTon.getInstance()
                .getEstimatedAmount(amountOfToken)
                .then((value) => {
                    setExchangedRateToken(value);
                });
        },
        SECOND / 5,
        [amountOfToken]
    );

    const handleClose = () => {
        drawerDispatch.close(DRAWER_ID.WALLET_TRADE);
    };

    const handleAmountOfToken = (e: any) => {
        setAmountOfToken(e.target.value);
    };
    const handleMaxAmount = () => {
        setAmountOfToken(tokenList[optionFrom]?.amountOfToken);
    };
    const handleOptionFromChange = (value: ContractGuard) => {
        setOptionFrom(value);
    };
    const handleOptionToChange = (value: ContractGuard) => {
        setOptionTo(value);
    };
    const handleSwipeToAndFrom = () => {
        setOptionFrom(optionTo);
        setOptionTo(optionFrom);
        setAmountOfToken(exchangedRateToken);
    };
    return (
        <Drawer
            from="right"
            drawerID={DRAWER_ID.WALLET_TRADE}
            widthPercent={80}
            heightPercent={50}
            onClose={handleClose}
        >
            <Column>
                <HeaderDrawer asLeftIcon={<Refresh />} asRightIcon={<Close onClick={handleClose} />} title="Trade" />
                <Section>
                    <Row justifyContent="space-between" style={{ width: '100%' }}>
                        <TRLabel
                            sizing="md"
                            style={{ display: 'flex', textAlign: 'center' }}
                            color={theme.palette.text.secondary}
                        >
                            From
                        </TRLabel>
                        <TRLabel
                            sizing="xs"
                            style={{ display: 'flex', textAlign: 'center' }}
                            color={theme.palette.text.disabled}
                        >
                            Balance : {tokenList[optionFrom]?.amountOfToken}
                        </TRLabel>
                    </Row>
                    <Row gap="12px" alignItems="flex-start">
                        <InputWithAdorments
                            type="number"
                            onChange={handleAmountOfToken}
                            style={{ width: '188px' }}
                            value={amountOfToken}
                            errors={
                                Number(amountOfToken) > tokenList[optionFrom]?.amountOfToken
                                    ? { message: 'Not enough amount.' }
                                    : { message: '' }
                            }
                            asEnd={
                                <TRLabel weight="bold" color="primary" sizing="sm" onClick={handleMaxAmount}>
                                    MAX
                                </TRLabel>
                            }
                        />
                        <TokenDropDown>
                            <Row gap="4px">
                                <Image
                                    src={`/images/${optionFrom}-symbol.png`}
                                    alt={optionFrom}
                                    width={20}
                                    height={20}
                                />
                                <TRLabel sizing="sm" weight="bold">
                                    {optionFrom}
                                </TRLabel>
                            </Row>
                            <TRSelectModal
                                name="sort options"
                                onChange={handleOptionFromChange}
                                defaultValue={1}
                                options={filterOptions}
                                value={optionFrom}
                                asTrigger={
                                    <Row>
                                        <KeyboardArrowDown color="primary" style={{ width: '24px' }} />
                                    </Row>
                                }
                            >
                                {TokenList.map((value, index) => (
                                    <Row key={index} gap="8px">
                                        <Image src={`/images/${value}-symbol.png`} alt={value} width={24} height={24} />
                                        <span>{value}</span>
                                    </Row>
                                ))}
                            </TRSelectModal>
                        </TokenDropDown>
                    </Row>
                </Section>
                <TRIconButton
                    onClick={handleSwipeToAndFrom}
                    sizing="lg"
                    variant="contained"
                    style={{ margin: '20px 0px' }}
                    asIcon={
                        <Row style={{ width: '100%', height: '100%' }}>
                            <Image src="/images/change-symbol.png" alt="change-symbol" height={24} width={24} />
                        </Row>
                    }
                />
                <Section>
                    <TRLabel
                        sizing="md"
                        style={{ display: 'flex', textAlign: 'center' }}
                        color={theme.palette.text.secondary}
                    >
                        To (Estimated)
                    </TRLabel>
                    <Row gap="12px">
                        <InputWithAdorments
                            type="number"
                            style={{ width: '188px' }}
                            value={exchangedRateToken}
                            disabled
                        />
                        <TokenDropDown>
                            <Row gap="4px">
                                <Image src={`/images/${optionTo}-symbol.png`} alt={optionTo} width={20} height={20} />
                                <TRLabel sizing="sm" weight="bold">
                                    {optionTo}
                                </TRLabel>
                            </Row>
                            <TRSelectModal
                                name="sort options"
                                onChange={handleOptionToChange}
                                defaultValue={1}
                                options={filterOptions}
                                value={optionTo}
                                asTrigger={
                                    <Row>
                                        <KeyboardArrowDown color="primary" style={{ width: '24px' }} />
                                    </Row>
                                }
                            >
                                {TokenList.map((value, index) => (
                                    <Row key={index} gap="8px">
                                        <Image src={`/images/${value}-symbol.png`} alt={value} width={24} height={24} />
                                        <span>{value}</span>
                                    </Row>
                                ))}
                            </TRSelectModal>
                        </TokenDropDown>
                    </Row>
                    <TRLabel
                        sizing="xs"
                        style={{ display: 'flex', textAlign: 'center' }}
                        color={theme.palette.text.disabled}
                    >
                        Slippage Tolarance:
                        <TRLabel
                            sizing="xs"
                            style={{ display: 'flex', textAlign: 'center', marginLeft: '5px' }}
                            color={theme.palette.text.primary}
                            weight="bold"
                        >
                            0.5%
                        </TRLabel>
                    </TRLabel>
                </Section>
            </Column>
        </Drawer>
    );
};
