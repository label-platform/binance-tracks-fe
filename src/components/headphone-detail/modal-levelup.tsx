import { Column, Row, TRDivider } from '@components/common/flex';
import { LabelRoundPercent } from '@components/common/labels/label-round-percent';
import { Modal } from '@components/common/modals/modal';
import { MODAL_ID, SECOND } from '@constants/common';

import Image from 'next/image';
import { useState } from 'react';
import { useModalDispatch } from 'src/recoil/modal';

import {
    useHeadphoneSingleQuery,
    useHeadphoneCalculateLevelupCostQuery,
    useHeadphoneCalculateLevelupBoostCostQuery,
    useHeadphoneLevelupBoostQuery,
    useRequestHeadphoneLevelupQuery,
    useConfirmHeadphoneLevelupQuery,
} from 'src/react-query/inventory';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { calculateDuration } from '@utils/timeCalculator';
import { ITEM_STATUS } from '@models/common.interface';
import { TRButton } from '@components/common/buttons/button';
import { Close } from '@mui/icons-material';
import { TRLabel } from '@components/common/labels/label';
import { useTheme } from '@emotion/react';
import { useMessageDispatch } from 'src/recoil/message';
import { TRLabelTimer } from '@components/common/labels/label-timer';

export function BeforeLevelUpContent() {
    const { query } = useRouter();
    const { levelUpCost, isError, isLoading } = useHeadphoneCalculateLevelupCostQuery(String(query?.id));
    const { headphone } = useHeadphoneSingleQuery(String(query?.id));
    const { palette } = useTheme();
    const { t } = useTranslation('common', { keyPrefix: 'levelUp' });

    if (!headphone || isLoading) {
        return <></>;
    }

    if (isError) {
        return (
            <Row>
                <TRLabel style={{ textAlign: 'center' }} weight="bold">
                    Other headphone is levelling up already.
                </TRLabel>
            </Row>
        );
    }

    const duration = calculateDuration(levelUpCost.levelUpCompletionTime);

    return (
        <Column sx={{ width: '100%' }}>
            <Image src={headphone.imgUrl} alt="" width={132} height={132} />
            <TRLabel style={{ marginTop: 12 }} color={palette.text.secondary} sizing="sm">
                Lv. {headphone.level}
            </TRLabel>
            <Column gap={2} style={{ width: '100%', marginTop: 24 }}>
                <Row alignSelf="stretch" justifyContent="space-between">
                    <TRLabel>
                        From{' '}
                        <TRLabel style={{ marginLeft: 8 }} weight="bold">
                            Lv. {headphone.level}
                        </TRLabel>
                    </TRLabel>
                    <TRLabel>
                        To{' '}
                        <TRLabel style={{ marginLeft: 8 }} weight="bold">
                            Lv. {headphone.level + 1}
                        </TRLabel>
                    </TRLabel>
                </Row>
                <TRDivider.Column />
                <Row alignSelf="stretch" justifyContent="space-between">
                    <TRLabel>Cost</TRLabel>
                    <TRLabel weight="bold">
                        {levelUpCost.costs[0].requiredCost}
                        <TRLabel style={{ marginLeft: 8 }}>{levelUpCost.costs[0].tokenSymbol}</TRLabel>
                    </TRLabel>
                </Row>
                <Row alignSelf="stretch" justifyContent="space-between">
                    <TRLabel>Time</TRLabel>
                    <TRLabel weight="bold">
                        {duration.asMinutes().toFixed()}
                        <TRLabel style={{ marginLeft: 8 }}>mins</TRLabel>
                    </TRLabel>
                </Row>
            </Column>
        </Column>
    );
}

export function OnGoingLevelUpContent() {
    const { query } = useRouter();
    const { headphone } = useHeadphoneSingleQuery(String(query?.id));
    const { palette } = useTheme();

    const remainDuration = headphone?.remainDurationForLevelup;
    const totalDuration = headphone?.totalDurationForLevelup;

    const rate =
        remainDuration && totalDuration
            ? Math.round(((totalDuration.asMinutes() - remainDuration.asMinutes()) / totalDuration.asMinutes()) * 100)
            : 0;

    if (!headphone.id) {
        return null;
    }

    return !headphone.isLevelupFinished ? (
        <Column sx={{ width: '100%' }}>
            <Image src={headphone.imgUrl} alt="" width={132} height={132} />
            <TRLabel style={{ marginTop: 12 }} color={palette.text.secondary} sizing="sm">
                Lv. {headphone.level}
            </TRLabel>
            <Column gap={2} style={{ width: '100%', marginTop: 24 }}>
                <Row alignSelf="stretch" justifyContent="space-between">
                    <TRLabel>
                        Level up to
                        <TRLabel style={{ marginLeft: 8 }} weight="bold">
                            Lv. {headphone.level + 1}
                        </TRLabel>
                    </TRLabel>
                </Row>
                <TRDivider.Column />
                <LabelRoundPercent
                    sizing="xxs"
                    percent={rate}
                    style={{ width: '100%', height: 20 }}
                    color="white"
                    asLabel={`${rate}%`}
                />
                <Row alignSelf="stretch" justifyContent="space-between">
                    <TRLabel>Remaining time</TRLabel>
                    <TRLabelTimer format="hh:mm:ss" duration={remainDuration} />
                </Row>
            </Column>
        </Column>
    ) : (
        <Column sx={{ width: '100%' }}>
            <Image src={headphone.imgUrl} alt="" width={132} height={132} />
            <TRLabel style={{ marginTop: 12 }} color={palette.text.secondary} sizing="sm">
                Lv. {headphone.level}
            </TRLabel>
            <Column gap={2} style={{ width: '100%', marginTop: 24 }}>
                <Row alignSelf="stretch" justifyContent="space-between">
                    <TRLabel>
                        Level up to
                        <TRLabel style={{ marginLeft: 8 }} weight="bold">
                            Lv. {headphone.level + 1}
                        </TRLabel>
                    </TRLabel>
                </Row>
                <TRDivider.Column />
                <Row alignSelf="stretch" justifyContent="center">
                    <TRLabel>Finish to ready to level up</TRLabel>
                </Row>
            </Column>
        </Column>
    );
}

export function ModalLevelup() {
    const { query } = useRouter();
    const { headphone } = useHeadphoneSingleQuery(String(query?.id));
    const requestLevelUp = useRequestHeadphoneLevelupQuery();
    const confirmLevelUp = useConfirmHeadphoneLevelupQuery();
    const boostLevelUp = useHeadphoneLevelupBoostQuery();
    const { palette } = useTheme();
    const { levelUpBoostCost } = useHeadphoneCalculateLevelupBoostCostQuery(headphone);
    const { close } = useModalDispatch();
    const { message } = useMessageDispatch();
    const handleModalClose = () => {
        close(MODAL_ID.LEVELUP_MODAL);
    };

    const handleRequestLevelUp = () => {
        requestLevelUp.mutate(
            { headphoneId: String(query?.id) },
            {
                onSuccess() {
                    message.none('Successfully set');
                },
                onError() {
                    message.none('fail to level up');
                },
                onSettled() {
                    close(MODAL_ID.LEVELUP_MODAL);
                },
            }
        );
    };

    const handleConfirmLevelUp = () => {
        confirmLevelUp.mutate(
            { headphoneId: String(query?.id) },
            {
                onSuccess() {
                    message.none('Successfully set');
                },
                onError() {
                    message.none('fail to level up');
                },
                onSettled() {
                    close(MODAL_ID.LEVELUP_MODAL);
                },
            }
        );
    };

    const handleBoostClick = () => {
        if (levelUpBoostCost === undefined) return;
        const [blb] = levelUpBoostCost.costs;
        Modal.confirm({
            title: 'Boost',
            content: (
                <Column>
                    <Image src={headphone.imgUrl} alt="" width={132} height={132} />
                    <TRLabel style={{ marginTop: 12 }} color={palette.text.secondary} sizing="sm">
                        Lv. {headphone.level}
                    </TRLabel>
                    <Column alignItems="flex-start" gap={2} style={{ width: '100%', marginTop: 24 }}>
                        <TRLabel color={palette.text.secondary}>to boost Leveling up</TRLabel>
                        <Row alignSelf="stretch" justifyContent="space-between">
                            <TRLabel>Cost</TRLabel>
                            <TRLabel weight="bold">
                                {blb.requiredCost}
                                <TRLabel style={{ marginLeft: 8 }}>{blb.tokenSymbol}</TRLabel>
                            </TRLabel>
                        </Row>
                    </Column>
                </Column>
            ),
            okText: 'Confirm',
            handleOkClick() {
                boostLevelUp.mutate(
                    { headphoneId: String(query?.id) },
                    {
                        onSuccess() {
                            message.none('Successfully levelup');
                            close(MODAL_ID.LEVELUP_MODAL);
                        },
                        onError() {
                            message.none(
                                // eslint-disable-next-line quotes
                                "You don't have enought token to boost headphone, Please earn more tokens"
                            );
                        },
                    }
                );
            },
        });
    };

    return (
        <Modal
            asTitle="Level Up"
            onClose={handleModalClose}
            asCloseIcon={<Close />}
            modalID={MODAL_ID.LEVELUP_MODAL}
            asFooter={
                <Row style={{ width: '100%' }}>
                    <TRButton
                        style={{ width: '100%' }}
                        onClick={
                            headphone.status === ITEM_STATUS.LEVELING
                                ? headphone.isLevelupFinished
                                    ? handleConfirmLevelUp
                                    : handleBoostClick
                                : handleRequestLevelUp
                        }
                    >
                        {headphone.status === ITEM_STATUS.LEVELING
                            ? headphone.remainDurationForLevelup.asSeconds() > 0
                                ? 'Boost'
                                : 'Level up'
                            : 'Confirm'}
                    </TRButton>
                </Row>
            }
        >
            <Row sx={{ my: 3, width: '100%' }}>
                {headphone.status === ITEM_STATUS.IDLE ? (
                    <BeforeLevelUpContent />
                ) : headphone.status === ITEM_STATUS.LEVELING ? (
                    <OnGoingLevelUpContent />
                ) : (
                    <></>
                )}
            </Row>
        </Modal>
    );
}
