/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { AuthGuard } from 'src/components/authentication/auth-guard';
import { MainLayout } from '@components/common/layouts/main-layout';

import { useUnmount } from 'react-use';

import { HeadphoneInfoBox } from '@components/common/headphone-info-box';
import { Column, Row } from '@components/common/flex';

import { HeadphoneDetailNavBottom } from '@components/headphone-detail/headphone-detail-nav-bottom';
import { useRouter } from 'next/router';
import { useHeadphoneDispatch } from 'src/recoil/headphone';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ModalDockOpen } from '@components/headphone-detail/modal-dock-confirm';

import { useHeadphoneReleaseCoolDown, useHeadphoneSingleQuery } from 'src/react-query/inventory';

import { useMessageDispatch } from 'src/recoil/message';
import { HeadphoneWithDocks } from '@components/common/headphone-with-docks';
import { TRLabel } from '@components/common/labels/label';
import { TRButton } from '@components/common/buttons/button';
import { useTheme } from '@emotion/react';
import { AttributePoint } from '@components/common/attribute-point';
import { ChevronLeft } from '@mui/icons-material';
import { TRBadge } from '@components/common/badge';
import { ItemThumbnail } from '@components/common/item-thumbnail';
import { Dock } from '@models/dock/dock';
import { DOCK_STATUS } from '@models/dock/dock.interface';
import { useModalDispatch } from 'src/recoil/modal';
import { DRAWER_ID, MODAL_ID } from '@constants/common';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { DrawerSelectDock } from '@components/headphone-detail/drawer-select-dock';

import { ModalRemoveSticker } from '@components/headphone-detail/modal-remove-sticker';
import { Page } from 'types/page';
import { DrawerManagePoint } from '@components/headphone-detail/drawer-manage-point';
import { ModalLevelup } from '@components/headphone-detail/modal-levelup';
import { ModalCharge } from '@components/headphone-detail/modal-charge';
import { ModalTransfer } from '@components/headphone-detail/modal-transfer';
import { ModalSellItem } from '@components/common/modal-sell-item';
import { ModalPriceModifyItem } from '@components/common/modal-price-modify-item';
import { Skeleton } from '@mui/material';
import { doEither, sendToNative } from '@utils/native';
import { NATIVE_EVENT } from '@constants/native-event';
import { ITEM_STATUS } from '@models/common.interface';
import { TRLabelTimer } from '@components/common/labels/label-timer';

const HeadphoneDetail: Page = () => {
    const { query, back } = useRouter();
    const headPhoneDispatch = useHeadphoneDispatch();

    const { message } = useMessageDispatch();
    const [isBase, setIsBase] = useState<boolean>(false);
    const { headphone, isSuccess } = useHeadphoneSingleQuery(String(query?.id));
    const { mutate } = useHeadphoneReleaseCoolDown();
    const modalDispatch = useModalDispatch();
    const drawerDispatch = useDrawerDispatch();
    const [selectedDock, setSelectedDock] = useState<Dock>();
    const { palette } = useTheme();
    const handleBaseClick = () => {
        setIsBase((status) => !status);
    };

    const handleGoBackClick = () => {
        doEither(
            () => {
                back();
            },
            () => {
                sendToNative({ name: NATIVE_EVENT.BACK });
            }
        );
    };

    const handleHeadphoneReleaseCoolDownClick = () => {
        mutate(
            { headphoneId: headphone.id },
            {
                onSuccess() {
                    message.none('Successfully set');
                },
                onError() {
                    message.none('Error has been occurred');
                },
            }
        );
    };

    const handlePointClick = () => {
        drawerDispatch.open(DRAWER_ID.MANAGE_POINT);
    };

    const handleDockClick = (dock: Dock) => {
        switch (dock.status) {
            case DOCK_STATUS.LOCK: {
                message.none(`This dock is available ae Hedphone level ${dock.unlockLevel}.`);
                break;
            }
            case DOCK_STATUS.NOT_OPENED: {
                modalDispatch.open(MODAL_ID.DOCK_OPEN_MODAL, dock);
                break;
            }
            case DOCK_STATUS.OPENED: {
                setSelectedDock(dock);
                drawerDispatch.open(DRAWER_ID.SELECT_DOCK);
                break;
            }
            case DOCK_STATUS.INSERTED: {
                modalDispatch.open(MODAL_ID.REMOVE_STICKER_MODAL, dock);

                break;
            }
            default: {
                break;
            }
        }
    };

    useUnmount(() => headPhoneDispatch.clear());

    useEffect(() => {
        headPhoneDispatch.set(headphone);
    }, [headphone.id]);

    if (!isSuccess) {
        return (
            <Column gap={3}>
                <HeadphoneInfoBox.Skeleton />
                <Column alignSelf="stretch">
                    <Row alignSelf="stretch" gap={1}>
                        <Skeleton height={30} variant="text" sx={{ flex: 1 }} />
                        <Skeleton height={30} variant="text" sx={{ flex: 2 }} />
                    </Row>
                    <Row alignSelf="stretch" gap={1}>
                        <Skeleton height={30} variant="text" sx={{ flex: 1 }} />
                        <Skeleton height={30} variant="text" sx={{ flex: 2 }} />
                    </Row>
                    <Row alignSelf="stretch" gap={1}>
                        <Skeleton height={30} variant="text" sx={{ flex: 1 }} />
                        <Skeleton height={30} variant="text" sx={{ flex: 2 }} />
                    </Row>
                    <Row alignSelf="stretch" gap={1}>
                        <Skeleton height={30} variant="text" sx={{ flex: 1 }} />
                        <Skeleton height={30} variant="text" sx={{ flex: 2 }} />
                    </Row>
                </Column>
            </Column>
        );
    }

    return (
        <Column
            justifyContent="flex-start"
            sx={{ position: 'relative', pt: 1, pb: 4, overflowY: 'auto', height: '100%' }}
        >
            {headphone.id && (
                <>
                    <ChevronLeft
                        onClick={handleGoBackClick}
                        sx={{ fill: palette.text.primary, position: 'absolute', left: 0, top: 0, zIndex: 999 }}
                    />
                    <HeadphoneInfoBox
                        headphone={headphone}
                        asHeadPhone={<HeadphoneWithDocks handleClick={handleDockClick} headphone={headphone} />}
                    />
                    {headphone.status === ITEM_STATUS.COOLDOWN ? (
                        <Row justifyContent="space-between" alignSelf="stretch" sx={{ mt: 2 }}>
                            {headphone.isCoolDownFinished ? (
                                <TRButton
                                    onClick={handleHeadphoneReleaseCoolDownClick}
                                    style={{ width: '100%', fontSize: '10px' }}
                                    sizing="xs"
                                >
                                    Release the cooldown
                                </TRButton>
                            ) : (
                                <>
                                    <TRLabel>Remain cooldown time</TRLabel>
                                    <TRLabel>
                                        <TRLabelTimer
                                            format="hh:mm:ss"
                                            duration={headphone.remainDurationForCoolDown}
                                        />
                                    </TRLabel>
                                </>
                            )}
                        </Row>
                    ) : null}
                    <Row alignSelf="stretch" sx={{ mt: 4, mb: 3, mr: '10px' }} justifyContent="space-between">
                        <TRLabel weight="bold" sizing="lg">
                            Attribute
                        </TRLabel>
                        <Row style={{ gap: '8px' }}>
                            <TRButton
                                onClick={handleBaseClick}
                                style={{
                                    fontSize: '12px',
                                    lineHeight: '20px',
                                    color: isBase ? palette.primary.main : palette.light.main,
                                }}
                                variant="outlined"
                                sizing="xs"
                            >
                                Base
                            </TRButton>
                            <TRBadge
                                asRoot={
                                    <span>
                                        <TRButton
                                            onClick={handlePointClick}
                                            style={{
                                                fontSize: '12px',
                                                lineHeight: '20px',
                                            }}
                                            variant="contained"
                                            sizing="xs"
                                        >
                                            Point
                                        </TRButton>
                                    </span>
                                }
                            >
                                {headphone?.points.remain > 0 && (
                                    <TRBadge.Item anchorOrigin={{ vertical: 'top', horizon: 'right' }}>
                                        <TRLabel
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '999px',
                                                color: 'white',
                                            }}
                                            variant="contained"
                                            color="primary"
                                            sizing="xxs"
                                            weight="bold"
                                        >
                                            {headphone?.points.remain}
                                        </TRLabel>
                                    </TRBadge.Item>
                                )}
                            </TRBadge>
                        </Row>
                    </Row>
                    <AttributePoint
                        isBase={isBase}
                        basePoints={headphone?.points.base}
                        itemPoints={headphone?.points.item}
                        levelupPoints={headphone?.points.level}
                    />
                </>
            )}

            <ModalDockOpen />
            <ModalRemoveSticker />
            <ModalLevelup />
            <ModalCharge />
            <ModalTransfer/>
            <ModalSellItem />
            <ModalPriceModifyItem />
            <DrawerManagePoint headphone={headphone} />
            <DrawerSelectDock headphone={headphone} selectedDock={selectedDock} />
        </Column>
    );
};

HeadphoneDetail.getLayout = (page: React.ReactElement) => (
    <AuthGuard>
        <MainLayout asFooter={<HeadphoneDetailNavBottom />}>{page}</MainLayout>
    </AuthGuard>
);

export const getServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common'])),
    },
});

export default HeadphoneDetail;
