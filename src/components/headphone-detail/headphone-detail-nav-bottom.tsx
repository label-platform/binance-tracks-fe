/* eslint-disable quotes */
import { TRIconButton } from '@components/common/buttons/icon-button';
import { Column, Row } from '@components/common/flex';

import { useModalDispatch } from 'src/recoil/modal';
import { DRAWER_ID, MODAL_ID } from '@constants/common';
import { useRouter } from 'next/router';

import { useHeadphoneSingleQuery } from 'src/react-query/inventory';
import { useMessageDispatch } from 'src/recoil/message';
import { ChargeMenuIcon, LeaseMenuIcon, LevelUpMenuIcon, SellMenuIcon, TransferMenuIcon } from '@icons';
import { TRLabel } from '@components/common/labels/label';
import { ITEM_STATUS } from '@models/common.interface';
import { Modal } from '@components/common/modals/modal';
import { HeadphoneInfoBox } from '@components/common/headphone-info-box';
import Image from 'next/image';
import { useCancelSellQuery } from 'src/react-query/marketplace';
import { DrawerCheckPasscode } from '@components/common/drawer-check-passcode';
import { useDrawerDispatch } from 'src/recoil/drawer';

export function HeadphoneDetailNavBottom() {
    const { open } = useModalDispatch();
    const router = useRouter();
    const { headphone } = useHeadphoneSingleQuery(String(router.query?.id));
    const { message } = useMessageDispatch();
    const sellCancelQuery = useCancelSellQuery();
    const drawerDispatch = useDrawerDispatch();
    const handleLevelUpModalOpen = () => {
        if (headphone.status === ITEM_STATUS.IDLE || headphone.status === ITEM_STATUS.LEVELING) {
            open(MODAL_ID.LEVELUP_MODAL);
        } else {
            message.none("headphone isn't available for levelup");
        }
    };

    const handleChargeModalOpen = () => {
        if (headphone.isCanBeCharged) {
            open(MODAL_ID.CHARGE_MODAL, headphone);
        } else {
            message.none("headphone isn't available for charge");
        }
    };

    const handleSellRegisterModalOpen = (e) => {
        if (headphone.isCanBeSelled) {
            open(MODAL_ID.SELL_ITEM_MODAL, headphone);
        } else if (headphone.status === ITEM_STATUS.SELLING) {
            Modal.confirm({
                title: 'Selling',
                content: (
                    <Column gap={2} style={{ width: '100%' }}>
                        <HeadphoneInfoBox
                            headphone={headphone}
                            asHeadPhone={<Image src={headphone.imgUrl} width={132} height={132} alt="" />}
                        />
                        <Row alignSelf="stretch" justifyContent="space-between">
                            <TRLabel>Date</TRLabel>
                            <TRLabel weight="bold">{headphone.dateRegisterdSell}</TRLabel>
                        </Row>
                        <Row alignSelf="stretch" justifyContent="space-between">
                            <TRLabel>Price</TRLabel>
                            <TRLabel weight="bold">
                                {headphone.price}
                                <TRLabel style={{ marginLeft: 8 }}>{headphone.sellCurrency}</TRLabel>
                            </TRLabel>
                        </Row>
                    </Column>
                ),
                okText: 'Change',
                handleOkClick() {
                    open(MODAL_ID.PRICE_MODIFY_ITEM_MODAL, headphone);
                },
                cancelText: 'Revoke',
                handleCancelClick() {
                    sellCancelQuery.mutate({ sellId: headphone.sellId });
                },
            });
        } else {
            message.none("headphone isn't available for sale");
        }
    };

    const handleTransferModalOpen = (e) => {
        if (!headphone.isCanBeTransfered) {
            message.none("headphone isn't available for trasfer");
            return;
        }
        Modal.confirm({
            title: 'Warning',
            content: 'Are you sure you want to continue?',
            okText: 'Confirm',
            handleOkClick() {
                drawerDispatch.open(DRAWER_ID.CHECK_PASSCODE);
            },
        });
    };

    const handleLeaseClick = () => {
        message.none('comming soon');
    };

    const checkPasscodeSuccess = () => {
        drawerDispatch.closeAll();
        open(MODAL_ID.TRANSFER_MDOAL, headphone);
    };

    return (
        <>
            <Row justifyContent="space-between">
                <Column>
                    <TRIconButton
                        onClick={handleLevelUpModalOpen}
                        color="light"
                        variant="none"
                        sizing="lg"
                        sx={{
                            '& > svg ': {
                                position: 'absolute',
                                left: '70%',
                                top: '60%',
                                transform: 'translate(-50%, -50%)',
                            },
                        }}
                        asIcon={<LevelUpMenuIcon />}
                    />
                    <TRLabel sizing="xxs">Level Up</TRLabel>
                </Column>
                <Column>
                    <TRIconButton
                        onClick={handleChargeModalOpen}
                        color="light"
                        variant="none"
                        sizing="lg"
                        sx={{
                            '& > svg ': {
                                position: 'absolute',
                                left: '70%',
                                top: '60%',
                                transform: 'translate(-50%, -50%)',
                            },
                        }}
                        asIcon={<ChargeMenuIcon />}
                    />
                    <TRLabel sizing="xxs">Charge</TRLabel>
                </Column>

                <Column>
                    <TRIconButton
                        color="light"
                        variant="none"
                        sizing="lg"
                        asIcon={<SellMenuIcon />}
                        onClick={handleSellRegisterModalOpen}
                    />
                    <TRLabel sizing="xxs">Sell</TRLabel>
                </Column>
                <Column>
                    <TRIconButton
                        color="light"
                        variant="none"
                        sizing="lg"
                        onClick={handleLeaseClick}
                        asIcon={<LeaseMenuIcon />}
                    />
                    <TRLabel sizing="xxs">Lease</TRLabel>
                </Column>
                <Column>
                    <TRIconButton
                        color="light"
                        variant="none"
                        sizing="lg"
                        onClick={handleTransferModalOpen}
                        asIcon={<TransferMenuIcon />}
                    />
                    <TRLabel sizing="xxs">Transfer</TRLabel>
                </Column>
            </Row>
            <DrawerCheckPasscode handleSuccess={checkPasscodeSuccess} />
        </>
    );
}
