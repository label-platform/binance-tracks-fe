import { Column, Row } from '@components/common/flex/index';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { LabelWithIcon } from '@components/common/labels/label-with-icon';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { DRAWER_ID } from '@constants/common';
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import { ToExternalDrawer } from '@components/my-wallet/wallet-to-external-drawer';
import { WalletTradeDrawer } from './wallet-trade-drawer';
import { TRIconButton } from '@components/common/buttons/icon-button';
import { TRSelectModal } from '@components/common/inputs/select';
import { useGetTokenBalanceOfWallet, useGetNFTBalanceOfWallet } from 'src/react-query/wallet';
import Image from 'next/image';
import { TRLabel } from '@components/common/labels/label';
import { useMessageDispatch } from 'src/recoil/message';
import { useTheme } from '@emotion/react';
import { TransferTo } from '@components/my-wallet/wallet-transfer-to-drawer';
import { AddFunds } from '@components/my-wallet/wallet-add-funds-drawer';
import { WalletNFTList } from '@components/my-wallet/wallet-NFT-List-drawer';
import { useUserSelfInfoQuery } from 'src/react-query/user';
import { ContractGuard } from '@services/wallet/wallet';
import { MotionRefresh } from '@components/common/motion-refresh';
import { usePullToRefresh } from '@hooks/use-pull-to-refresh';
import { useClipboard } from '@hooks/use-clipboard';

const CoinContainer = styled(Column)`
    position: relative;
    border: 1px solid ${(props) => props.theme.palette.primary.main};
    border-radius: 10px;
    min-height: 50px;
    align-items: normal;
    width: 100%;
    margin-bottom: 20px;
`;
const EachCoinBox = styled(Row)`
    justify-content: space-between;
    padding: 16px;
    border-bottom: 0.5px solid ${(props) => props.theme.palette.primary.main};
    &:last-child {
        border: none;
    }
`;
const BNBAndWalletInfo = styled(Column)`
    gap: 8px;
    align-items: center;
`;

const WalletFunctionContainer = styled(Row)`
    width: 100%;
    height: 68px;
    gap: 24px;
    margin-top: 32px;
    margin-bottom: 28px;
    & .funcName {
        text-align: center;
        font-family: 'Gilroy';
        font-size: 10px;
        color: ${(props) => props.theme.palette.text.secondary};
    }
`;

export const Wallet = () => {
    const drawerDispatch = useDrawerDispatch();
    const { user, isLoading: isUserLoading, refetch: userRefetch } = useUserSelfInfoQuery();
    const { tokens, refetch: tokenRefetch, isLoading } = useGetTokenBalanceOfWallet(['BUSD', 'BNB', 'LBL', 'BLB']);
    const { nfts, refetch: nftRefetch } = useGetNFTBalanceOfWallet(['HEADPHONE', 'HEADPHONEBOX']);
    const { write } = useClipboard();
    const TokenList = {
        BUSD: {
            name: 'BUSD',
            amountOfToken: tokens?.BUSD,
        },
        BNB: {
            name: 'BNB',
            amountOfToken: tokens?.BNB,
        },
        LBL: {
            name: 'LBL',
            amountOfToken: tokens?.LBL,
        },
        BLB: {
            name: 'BLB',
            amountOfToken: tokens?.BLB,
        },
    };
    const { isOpen, isStart, percent, end, containerTarget } = usePullToRefresh({
        handleRefresh() {
            tokenRefetch();
            nftRefetch();
            userRefetch();
        },
        heightForRefresh: 60,
        depth: isLoading,
    });
    useEffect(() => {
        setTimeout(() => {
            end();
        }, 1000);
    }, [isStart]);

    const { message } = useMessageDispatch();
    const { palette } = useTheme();

    const [selectNFT, setSelectNFT] = useState<ContractGuard>(null);

    const copyWalletaddress = () => {
        try {
            write(user.walletAddress);
            message.none('Copied Success');
        } catch {
            message.error('error');
        }
    };

    const handleAddFundsOpen = () => {
        drawerDispatch.open(DRAWER_ID.ADD_FUNDS);
    };

    const handleTransferOpenClick = () => {
        drawerDispatch.open(DRAWER_ID.TRANSFER_TO);
    };

    const handleWalletTradeOpen = () => {
        message.error('comming soon');
        // drawerDispatch.open(DRAWER_ID.WALLET_TRADE);
    };

    const filterOptions = [
        { label: 'BUSD', value: 'BUSD' },
        { label: 'BNB', value: 'BNB' },
        { label: 'LBL', value: 'LBL' },
        { label: 'BLB', value: 'BLB' },
    ];

    const [option, setOption] = useState<ContractGuard>('BUSD');

    const handleOptionChange = (value: ContractGuard) => {
        setOption(value);
        drawerDispatch.open(DRAWER_ID.TO_EXTERNAL_DRAWER);
    };
    const handleNFTData = (value: ContractGuard) => {
        if (value) {
            setSelectNFT(value);
            drawerDispatch.open(DRAWER_ID.WALLET_NFT_LIST);
        } else {
            message.error('No NFT assets');
        }
    };

    if (isUserLoading) {
        return null;
    }

    return (
        <Column
            style={{
                width: '100% ',
                position: 'relative',
            }}
        >
            <MotionRefresh isOpen={isOpen} isStart={isStart} percent={percent} />

            <Column width="100%" height="100%" ref={containerTarget}>
                <Column justifyContent="flex-end">
                    <BNBAndWalletInfo>
                        <TRLabel color={palette.text.secondary}>BNB</TRLabel>
                        {/* TRLabel 수정필요 */}
                        <TRLabel sizing="xxl" weight="bold">
                            {TokenList.BNB.amountOfToken}
                        </TRLabel>
                        <TRLabel sizing="xs" onClick={copyWalletaddress} color={palette.text.secondary}>
                            {user.walletAddress.slice(0, 7)}...{user.walletAddress.slice(-7)}
                        </TRLabel>
                    </BNBAndWalletInfo>
                    <WalletFunctionContainer>
                        <Column style={{ gap: '8px', width: '100%', height: '68px' }}>
                            <TRIconButton
                                onClick={handleAddFundsOpen}
                                sizing="lg"
                                variant="contained"
                                asIcon={<VerticalAlignBottomOutlinedIcon sx={{ fill: 'white' }} />}
                            />
                            <TRLabel
                                sizing="xxs"
                                style={{ display: 'flex', textAlign: 'center' }}
                                color={palette.text.secondary}
                            >
                                Add <br /> Funds
                            </TRLabel>
                        </Column>
                        <Column style={{ gap: '8px', width: '100%', height: '68px' }}>
                            <TRIconButton
                                onClick={handleTransferOpenClick}
                                sizing="lg"
                                variant="contained"
                                asIcon={<LoopOutlinedIcon sx={{ fill: 'white' }} />}
                            />
                            <TRLabel
                                sizing="xxs"
                                style={{ display: 'flex', textAlign: 'center' }}
                                color={palette.text.secondary}
                            >
                                Transfer to Spending
                            </TRLabel>
                        </Column>
                        <Column style={{ gap: '8px', width: '100%', height: '68px' }}>
                            <TRSelectModal
                                name="sort options"
                                onChange={handleOptionChange}
                                defaultValue={1}
                                options={filterOptions}
                                value={option}
                                asTrigger={
                                    <TRIconButton
                                        sizing="lg"
                                        variant="contained"
                                        asIcon={<CallMadeOutlinedIcon sx={{ fill: 'white' }} />}
                                    />
                                }
                            >
                                {Object.keys(TokenList).map((value, index) => (
                                    <Row key={index} gap="8px">
                                        <Image src={`/images/${value}-symbol.png`} alt={value} width={24} height={24} />
                                        <span>{value}</span>
                                    </Row>
                                ))}
                            </TRSelectModal>
                            <TRLabel
                                sizing="xxs"
                                style={{ display: 'flex', textAlign: 'center' }}
                                color={palette.text.secondary}
                            >
                                Transfer to External
                            </TRLabel>
                        </Column>
                        <Column justifyContent="flex-start" style={{ gap: '8px', width: '100%', height: '68px' }}>
                            <TRIconButton
                                onClick={handleWalletTradeOpen}
                                sizing="lg"
                                variant="contained"
                                asIcon={<RepeatOutlinedIcon sx={{ fill: 'white' }} />}
                            />
                            <TRLabel
                                sizing="xxs"
                                style={{ display: 'flex', textAlign: 'center' }}
                                color={palette.text.secondary}
                            >
                                Trade Assets
                            </TRLabel>
                        </Column>
                    </WalletFunctionContainer>
                </Column>
                <CoinContainer>
                    {Object.keys(TokenList).map((value, index) => (
                        <EachCoinBox key={index} id={value}>
                            <LabelWithIcon
                                asIcon={
                                    <Image src={`/images/${value}-symbol.png`} alt={value} width={24} height={24} />
                                }
                                iconPosition="start"
                                label={value}
                                gap={1}
                            />
                            <span>{TokenList[value].amountOfToken}</span>
                        </EachCoinBox>
                    ))}
                </CoinContainer>
                {/* <CoinContainer>
                    <EachCoinBox onClick={() => handleNFTData('HEADPHONE')}>
                        <LabelWithIcon
                            asIcon={<Image src="/images/headphone-symbol.png" alt="Headphone" width={24} height={24} />}
                            iconPosition="start"
                            label="Headphone"
                            gap={1}
                        />
                        <span>{nfts?.HEADPHONE}</span>
                    </EachCoinBox>
                    <EachCoinBox onClick={() => handleNFTData('HEADPHONEBOX')}>
                        <LabelWithIcon
                            asIcon={
                                <Image
                                    src="/images/headphonebox-symbol.png"
                                    alt="Headphone Box"
                                    width={24}
                                    height={24}
                                />
                            }
                            iconPosition="start"
                            label="Headphone Box"
                            gap={1}
                        />
                        <span>{nfts?.HEADPHONEBOX}</span>
                    </EachCoinBox>
                    <EachCoinBox
                        onClick={() => {
                            message.error('Coming Soon');
                        }}
                    >
                        <LabelWithIcon
                            asIcon={
                                <Image src="/images/mysterybox-symbol.png" alt="Mystery Box" width={24} height={24} />
                            }
                            iconPosition="start"
                            label="Mystery Box"
                            gap={1}
                        />
                        <span></span>
                    </EachCoinBox>
                    <EachCoinBox
                        onClick={() => {
                            message.error('Coming Soon');
                        }}
                    >
                        <LabelWithIcon
                            asIcon={<Image src="/images/sticker-symbol.png" alt="Sticker" width={24} height={24} />}
                            iconPosition="start"
                            label="Sticker"
                            gap={1}
                        />
                        <span></span>
                    </EachCoinBox>
                </CoinContainer> */}
            </Column>

            <ToExternalDrawer id={option} token={+TokenList[option]?.amountOfToken} />
            <TransferTo />
            <WalletNFTList NFTType={selectNFT} />
            <WalletTradeDrawer tokenList={TokenList} />
            <AddFunds />
        </Column>
    );
};
