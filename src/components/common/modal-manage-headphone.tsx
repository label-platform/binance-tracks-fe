import { MODAL_ID } from '@constants/common';
import { useTheme } from '@emotion/react';

import { Close } from '@mui/icons-material';
import Image from 'next/image';
import { useModalDispatch, useModalState } from 'src/recoil/modal';
import { TRButton } from './buttons/button';
import { Column, Row } from './flex';

import { Modal } from './modals/modal';

import { useEffect, useState } from 'react';
import { useHeadphoneListeningQuery, useHeadphoneListQuery, useMountHeadphone } from 'src/react-query/inventory';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Headphone } from '@models/headphone/headphone';
import { TRLabel } from './labels/label';
import { LabelWithIcon } from './labels/label-with-icon';
import {
    AttributeEfficiencyIcon,
    AttributeLuckIcon,
    AttributeResilienceIcon,
    AttributeComfortIcon,
} from '@icons/index';

import { toInteger2Digits } from '@utils/string';
import { useMessageDispatch } from 'src/recoil/message';
import { Skeleton } from '@mui/material';
import { IconCircle } from './icon-circle';

function ContentSkeleton() {
    return (
        <Column sx={{ width: '100%', mt: 4 }} gap={2}>
            <Skeleton variant="circular" width={100} height={100} />
            <Row alignSelf="stretch" gap={1}>
                <Skeleton height={50} width={50} variant="circular" />
                <Skeleton height={50} width={50} variant="circular" />
                <Skeleton height={50} width={50} variant="circular" />
                <Skeleton height={50} width={50} variant="circular" />
            </Row>
            <Row alignSelf="stretch" gap={1}>
                <Skeleton height={80} sx={{ flex: 1 }} variant="rounded" />
            </Row>
        </Column>
    );
}

const ModalManageHeadphoneContent = () => {
    const _headphones = useHeadphoneListQuery({ take: 20 });
    const { headphone: activeHeadphone, isLoading: isActiveHeadphoneLoading } = useHeadphoneListeningQuery();
    const { palette } = useTheme();
    const headphones = _headphones.data || [];
    const mountHeadphone = useMountHeadphone();
    const { message } = useMessageDispatch();
    const [selectedHeadphone, setSelectedHeadphon] = useState<Headphone | null>(null);
    const handleHeadPhoneClick = (headphone: Headphone) => () => {
        setSelectedHeadphon(headphone);
    };

    const handleConfirmClick = () => {
        if (!selectedHeadphone.isCanBeMounted) {
            // eslint-disable-next-line quotes
            message.error("this headphone can't be mounted");
            return;
        }
        mountHeadphone.mutate(
            {
                headphoneId: selectedHeadphone.id,
            },
            {
                onError: () => {
                    message.error('error has been occurred');
                },
                onSuccess() {
                    message.none('Successfully set');
                },
            }
        );
    };

    useEffect(() => {
        if (activeHeadphone?.id) {
            setSelectedHeadphon(activeHeadphone);
        }
    }, [activeHeadphone?.id]);

    if (_headphones.isLoading || isActiveHeadphoneLoading) {
        return <ContentSkeleton />;
    }

    return (
        <>
            <Column style={{ width: '100%', marginTop: 24 }} gap={3}>
                {selectedHeadphone === null ? (
                    <IconCircle
                        style={{
                            backgroundColor: palette.dark.light,
                        }}
                        size={100}
                        asIcon={<Image alt="" src="/images/headphones/headphone_none.png" width={100} height={100} />}
                    />
                ) : (
                    <Image src={selectedHeadphone.imgUrl} width={132} height={132} alt="" />
                )}
                {headphones.length === 0 ? (
                    <TRLabel weight="bold">Please buy a headphone first</TRLabel>
                ) : (
                    <Swiper slidesPerView={4} spaceBetween={2}>
                        {headphones.map((headphone) => (
                            <SwiperSlide style={{ backgroundColor: 'transparent' }} key={headphone.id}>
                                {headphone.id === selectedHeadphone?.id ? (
                                    <>
                                        <Image
                                            onClick={handleHeadPhoneClick(headphone)}
                                            src={headphone.imgUrl}
                                            alt=""
                                            width={48}
                                            height={48}
                                        />
                                    </>
                                ) : (
                                    <Image
                                        onClick={handleHeadPhoneClick(headphone)}
                                        src={headphone.imgUrl}
                                        alt=""
                                        style={{ opacity: 0.5 }}
                                        width={48}
                                        height={48}
                                    />
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

                {selectedHeadphone !== null ? (
                    <Column
                        alignSelf="stretch"
                        style={{ borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.12)', padding: 20 }}
                        gap={2}
                    >
                        <Row alignSelf="stretch" justifyContent="space-between">
                            <TRLabel sizing="sm">Lv.{selectedHeadphone.level}</TRLabel>
                            <TRLabel>{selectedHeadphone.battery}%</TRLabel>
                        </Row>
                        <Row alignSelf="stretch" justifyContent="space-between">
                            <LabelWithIcon
                                asIcon={<AttributeEfficiencyIcon />}
                                label={`${selectedHeadphone.points.total.efficiency}`}
                            />
                            <LabelWithIcon
                                asIcon={<AttributeLuckIcon />}
                                label={`${selectedHeadphone.points.total.luck}`}
                            />
                            <LabelWithIcon
                                asIcon={<AttributeComfortIcon />}
                                label={`${selectedHeadphone.points.total.comfort}`}
                            />
                            <LabelWithIcon
                                asIcon={<AttributeResilienceIcon />}
                                label={`${selectedHeadphone.points.total.resilience}`}
                            />
                        </Row>
                    </Column>
                ) : null}

                <Row alignSelf="stretch" style={{ width: '100%' }}>
                    <TRButton
                        disabled={activeHeadphone?.id === selectedHeadphone?.id}
                        onClick={handleConfirmClick}
                        style={{ width: '100%' }}
                    >
                        Confirm
                    </TRButton>
                </Row>
            </Column>
        </>
    );
};

export const ModalManageHeadphone = () => {
    const { closeAll } = useModalDispatch();
    const { visible } = useModalState(MODAL_ID.MANAGE_HEADPHONE_MODAL);

    const handleModalCloseClick = () => {
        closeAll();
    };

    return (
        <Modal
            asCloseIcon={<Close />}
            onClose={handleModalCloseClick}
            asTitle="Equip Headphone"
            modalID={MODAL_ID.MANAGE_HEADPHONE_MODAL}
        >
            {visible ? <ModalManageHeadphoneContent /> : null}
        </Modal>
    );
};
