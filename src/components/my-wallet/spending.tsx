import React, { useEffect } from 'react';
import { TRButton } from '@components/common/buttons/button';
import { Column, Row, FlexItem } from '@components/common/flex/index';
import styled from '@emotion/styled';
import { LabelWithIcon } from '@components/common/labels/label-with-icon';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { DRAWER_ID } from '@constants/common';
import { Tabs } from '@components/common/tabs';
import { TransactionRecord } from '@components/common/transaction-record';
import { ContainerPullToRefresh } from '@components/common/pullToRefresh';
import { EmptyLabel } from '@components/common/labels/lable-empty';
import Image from 'next/image';
import { useUserBalanceQuery, useUserSelfInfoQuery } from 'src/react-query/user';
import { TransferTo } from '@components/my-wallet/wallet-transfer-to-drawer';
import { useGetWithdrawHistories } from 'src/react-query/wallet';
import { useIsMiniPlayerOn } from '@hooks/use-is-miniplayer-on';
import { usePullToRefresh } from '@hooks/use-pull-to-refresh';
import { MotionRefresh } from '@components/common/motion-refresh';

const CoinContainer = styled(Column)`
    position: relative;
    border: 1px solid ${(props) => props.theme.palette.primary.main};
    border-radius: 10px;
    /* min-height: 50px; */
    align-items: normal;
    width: 100%;
    /* margin: 16px; */
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
const WalletTabTitles = styled(Tabs.Titles)`
    margin-bottom: 16px;
    color: white;
    position: sticky;
    background-color: ${(props) => props.theme.palette.dark.main};
    top: 60px;
    z-index: 3;
    & > div {
        text-align: center;
        padding-bottom: 5px;
        &.active {
            border-bottom: 2px solid white;
        }
    }
`;

export const Spending = () => {
    const drawerDispatch = useDrawerDispatch();
    
    const _history = useGetWithdrawHistories(1, 50);
    const history = _history.histories.data;
    const _pendingHistory = useGetWithdrawHistories(1, 50, 'PENDING');
    const pendingHistory = _pendingHistory.histories.data;
    const isMiniPlayerOn = useIsMiniPlayerOn();
    const { user, refetch } = useUserSelfInfoQuery();
    const { isOpen, isStart, percent, end, containerTarget } = usePullToRefresh({
        handleRefresh() {
            _history.refetch();
            _pendingHistory.refetch();
            refetch();
        },
        heightForRefresh: 60,
        depth: _history.isLoading,
    });
    const handleTransferOpenClick = () => {
        drawerDispatch.open(DRAWER_ID.TRANSFER_TO);
    };
    useEffect(() => {
        setTimeout(() => {
            end();
        }, 1000);
    }, [isStart]);

    const TokenList = {
        BNB: {
            name: 'BNB',
            amountOfToken: user.spendingBalances.BNB,
        },
        LBL: {
            name: 'LBL',
            amountOfToken: user.spendingBalances.LBL,
        },
        BLB: {
            name: 'BLB',
            amountOfToken: user.spendingBalances.BLB,
        },
    };

    return (
        <Column
            style={{
                width: '100% ',
                position: 'relative',
            }}
        >
            <MotionRefresh isOpen={isOpen} isStart={isStart} percent={percent} />

            {/* <ContainerPullToRefresh onRefresh={test}> */}
            <Column width="100%" height="100%" ref={containerTarget}>
                <CoinContainer>
                    {Object.keys(TokenList).map((value, index) => (
                        <EachCoinBox key={index} id={value}>
                            <LabelWithIcon
                                asIcon={
                                    <Image
                                        src={`/images/${value}-symbol.png`}
                                        quality={100}
                                        alt={value}
                                        width={24}
                                        height={24}
                                    />
                                }
                                iconPosition="start"
                                label={value}
                                gap={1}
                            />
                            <span>{TokenList[value].amountOfToken}</span>
                        </EachCoinBox>
                    ))}
                </CoinContainer>

                <Tabs style={{ width: '100%', height: '100%' }}>
                    <WalletTabTitles>
                        <FlexItem style={{ maxWidth: '100%' }}>Pending</FlexItem>
                        <FlexItem style={{ maxWidth: '100%' }}>History</FlexItem>
                    </WalletTabTitles>
                    <Tabs.Panels style={{ width: '100%', position: 'relative', height: '100%' }}>
                        <Column gap="12px" style={{ width: '100%' }}>
                            {pendingHistory && pendingHistory?.length > 0 ? (
                                pendingHistory.map((data, index) => (
                                    <React.Fragment key={index}>
                                        <TransactionRecord
                                            isPending
                                            tokenAddress={data.tokenAddress}
                                            state={data.status}
                                            amountOfCoin={data.amount}
                                            date={data.updatedAt}
                                            walletAddress={data.mainWallet}
                                            category={data.category}
                                        />
                                    </React.Fragment>
                                ))
                            ) : (
                                <EmptyLabel message="No Transaction Record" />
                            )}
                        </Column>
                        <Column gap="12px" style={{ width: '100%' }}>
                            {history ? (
                                history.map((data, index) => (
                                    <React.Fragment key={index}>
                                        <TransactionRecord
                                            // isPending
                                            tokenAddress={data.tokenAddress}
                                            state={data.status}
                                            amountOfCoin={data.amount}
                                            date={data.updatedAt}
                                            walletAddress={data.mainWallet}
                                            category={data.category}
                                        />
                                    </React.Fragment>
                                ))
                            ) : (
                                <EmptyLabel message="No Transaction Record" />
                            )}
                        </Column>
                    </Tabs.Panels>
                </Tabs>
            </Column>
            {/* </ContainerPullToRefresh> */}
            <TRButton
                data-test-id="submit-activation-code"
                onClick={handleTransferOpenClick}
                sx={isMiniPlayerOn ? { bottom: '122px' } : { bottom: '16px' }}
                style={{ position: 'fixed', width: '360px' }}
                sizing="xl"
                type="submit"
            >
                Transfer
            </TRButton>
            <TransferTo isSpending />
        </Column>
    );
};
