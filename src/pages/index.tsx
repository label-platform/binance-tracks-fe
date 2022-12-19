import React, { useMemo, useEffect } from 'react';
import { AuthGuard } from 'src/components/authentication/auth-guard';
import { MainLayout } from '@components/common/layouts/main-layout';
import { Page } from 'types/page';
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';
import { useHeadphoneListeningQuery, useMysteryBoxListQuery } from 'src/react-query/inventory';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { TRBadge } from '@components/common/badge';

import { TRLabel } from '@components/common/labels/label';
import { ModalMysteryboxOpen } from '@components/main/modal-mysterybox-open';
import { useModalDispatch } from 'src/recoil/modal';
import { MODAL_ID } from '@constants/common';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { ModalManageHeadphone } from '@components/common/modal-manage-headphone';
import { ModalRegisterQR } from '@components/common/modal-register-qr';
import { Column, Row } from '@components/common/flex';
import { useTheme } from '@emotion/react';
import { useUserRegistWalletAddress, useUserSelfInfoQuery } from 'src/react-query/user';
import { IconCircle } from '@components/common/icon-circle';
import Image from 'next/image';
import { LabelWithGage } from '@components/common/labels/label-with-gage';
import { LabelWithIcon } from '@components/common/labels/label-with-icon';
import { BLBIcon, EnergyIcon } from '@icons';
import { Headphone } from '@models/headphone/headphone';
import { TRIconButton } from '@components/common/buttons/icon-button';
import PowerOutlinedIcon from '@mui/icons-material/PowerOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import { LabelRoundBarPercent } from '@components/common/labels/label-round-percent';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { TRButton } from '@components/common/buttons/button';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { doEither, sendToNative } from '@utils/native';
import { ScreenMysteryBox } from '@components/common/screens/screen-mysterbox';
import { Modal } from '@components/common/modals/modal';
import { TRInput } from '@components/common/inputs/input';
import { useForm } from 'react-hook-form';
import { NATIVE_EVENT, NATIVE_STACK } from '@constants/native-event';
import { MysteryboxCard } from '@components/main/mysterybox-card';
import { ModalCharge } from '@components/headphone-detail/modal-charge';
import { ModalGoogleAuthenticaton } from '@components/common/modal-google-authenticator';

const TEST_MODAL_ID = 'change-wallet';
/* 유저 월렛 변경해주는 거 임시로 만들어 둠 */
function ChangeWalletModal() {
    const { mutate } = useUserRegistWalletAddress();

    const { close } = useModalDispatch();
    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            address: '',
            pk: '',
        },
    });

    const handleWalletSaveClick = (form) => {
        mutate(form.address, {
            onSuccess() {
                doEither(
                    () => {
                        localStorage.setItem('pk', form.pk);
                    },
                    () => {
                        sendToNative({
                            name: NATIVE_EVENT.SAVE_PRIVATE_KEY,
                            params: { pk: form.pk, address: form.address },
                        });
                    }
                );
                close(TEST_MODAL_ID);
            },
        });
    };

    return (
        <Modal modalID={TEST_MODAL_ID}>
            <Column gap={2}>
                <TRInput asHelperText="address" {...register('address', { required: true })} />
                <TRInput asHelperText="pk" {...register('pk', { required: true })} />
                <TRButton disabled={!isValid} onClick={handleSubmit(handleWalletSaveClick)}>
                    Save
                </TRButton>
            </Column>
        </Modal>
    );
}

const Home: Page = () => {
    const { t } = useTranslation('common', { keyPrefix: 'main' });
    const { palette, clesson } = useTheme();
    const _mysteryBox = useMysteryBoxListQuery({});
    const { headphone } = useHeadphoneListeningQuery();
    const modalDispatch = useModalDispatch();
    const { user, isSuccess: userQueryIsSuccess } = useUserSelfInfoQuery();
    const { push } = useTracksRouter();
    const mysteryBoxes = useMemo(
        () => [...(_mysteryBox?.data || []), null, null, null, null].slice(0, 4),
        [_mysteryBox.data]
    );

    const handleGotoHeadphoneDetailClick = () => {
        //2. Home(My)에서 헤드폰 상세페이지로 접근 disable 기능추가로 제거
        // doEither(
        //     () => {
        //         push(`/headphone/${headphone.id}`);
        //     },
        //     () => {
        //         sendToNative({
        //             name: NATIVE_EVENT.SET_NO_BOTTOM_MENU,
        //             params: { url: `/headphone/${headphone.id}` },
        //         });
        //     }
        // );
    };

    const handleMysteryBoxOpenClick = (mysterybox) => () => {
        if (mysterybox) {
            modalDispatch.open(MODAL_ID.MYSTERYBOX_OPEN_MODAL, mysterybox);
        }
    };

    const handleEquipHeadphoneClick = () => {
        modalDispatch.open(MODAL_ID.MANAGE_HEADPHONE_MODAL);
    };

    const handleGoToProfileClick = () => {
        doEither(
            () => {
                push('/profile');
            },
            () => {
                sendToNative({
                    name: NATIVE_EVENT.SET_NO_BOTTOM_MENU,
                    params: { url: '/profile' },
                });
            }
        );
    };

    const handleGoToMarketPlace = () => {
        doEither(
            () => {
                push('/marketplace');
            },
            () => {
                sendToNative({
                    name: NATIVE_EVENT.REQUEST_NAVIGATION_TO_STACK,
                    params: { stack: NATIVE_STACK.MARKET },
                });
            }
        );
    };

    const handleGoToPlaylist = () => {
        doEither(
            () => {
                push('/playlist');
            },
            () => {
                sendToNative({
                    name: NATIVE_EVENT.REQUEST_NAVIGATION_TO_STACK,
                    params: { stack: NATIVE_STACK.PLAYLIST },
                });
            }
        );
    };

    if (!userQueryIsSuccess || _mysteryBox.isLoading) {
        return null;
    }

    return (
        <>
            <Column sx={{ borderRadius: 1, border: `1px solid ${palette.primary.main}` }}>
                <Row
                    alignSelf="stretch"
                    justifyContent="space-between"
                    sx={{ borderBottom: `1px solid ${palette.primary.main}`, px: '20px', py: '12px' }}
                >
                    <Row gap={1}>
                        <IconCircle
                            size={32}
                            asIcon={
                                <Image quality={100} src="/images/temp-profile.png" alt="" width={32} height={32} />
                            }
                        />
                        <TRLabel weight="bold" color={palette.primary.light}>
                            {user.name}
                        </TRLabel>
                    </Row>
                    <Row sx={{ gap: 2 }}>
                        {/* <HelpCenterOutlinedIcon color="primary" /> */}
                        <SettingsOutlinedIcon onClick={handleGoToProfileClick} color="primary" />
                    </Row>
                </Row>
                <Row
                    alignSelf="stretch"
                    justifyContent="space-between"
                    sx={{
                        borderBottom: `1px solid ${palette.primary.main}`,
                        p: '20px',
                        gap: '20px',
                        backgroundColor: `${palette.primary.main}1f`,
                    }}
                >
                    {headphone instanceof Headphone ? (
                        <>
                            <Row sx={{ flex: 1 }}>
                                <TRBadge
                                    asRoot={
                                        <span>
                                            <IconCircle
                                                style={{
                                                    border: `2px solid ${clesson.quality[headphone.quality]}`,
                                                    backgroundColor: clesson.quality[headphone.quality],
                                                }}
                                                onClick={handleGotoHeadphoneDetailClick}
                                                size={100}
                                                asIcon={
                                                    <Image alt="" src={headphone.imgUrl} width={100} height={100} />
                                                }
                                            />
                                        </span>
                                    }
                                >
                                    <TRBadge.Item
                                        style={{ transform: 'translate(-16px, -16px)' }}
                                        anchorOrigin={{ horizon: 'right', vertical: 'bottom' }}
                                    >
                                        {/* <TRIconButton
                                            onClick={handleEquipHeadphoneClick}
                                            sx={{
                                                backgroundColor: `${palette.dark.light} !important`,
                                                border: `1px solid ${palette.dark.light} !important`,
                                            }}
                                            color="primary"
                                            variant="outlined"
                                            asIcon={<CachedIcon />}
                                        /> */}
                                    </TRBadge.Item>
                                </TRBadge>
                            </Row>
                            <Column gap={1} alignSelf="stretch" sx={{ flex: 1 }}>
                                <TRLabel sizing="sm" weight="bold" color={clesson.quality[headphone.quality]}>
                                    {'#' + headphone.id}
                                </TRLabel>
                                {/* <TRLabel sizing="sm" weight="bold">
                                    Lv. {headphone.level}
                                </TRLabel> */}
                                <LabelRoundBarPercent
                                    height={20}
                                    width={96}
                                    maxGage={10}
                                    gage={headphone.batteryGage}
                                    sizing="xxs"
                                    asLabel=""
                                />
                            </Column>
                        </>
                    ) : (
                        <>
                            <Row sx={{ flex: 1 }}>
                                <TRBadge
                                    asRoot={
                                        <span>
                                            <IconCircle
                                                style={{
                                                    backgroundColor: palette.dark.light,
                                                }}
                                                onClick={handleEquipHeadphoneClick}
                                                size={100}
                                                asIcon={
                                                    <Image
                                                        alt=""
                                                        src="/images/headphones/headphone_none.png"
                                                        width={100}
                                                        height={100}
                                                    />
                                                }
                                            />
                                        </span>
                                    }
                                >
                                    <TRBadge.Item
                                        style={{ transform: 'translate(-16px, -16px)' }}
                                        anchorOrigin={{ horizon: 'right', vertical: 'bottom' }}
                                    >
                                        <TRIconButton
                                            onClick={handleEquipHeadphoneClick}
                                            color="primary"
                                            variant="contained"
                                            sizing="md"
                                            asIcon={<AddOutlinedIcon />}
                                        />
                                    </TRBadge.Item>
                                </TRBadge>
                            </Row>
                            <Column gap={1} alignSelf="stretch" sx={{ flex: 1 }}>
                                <TRLabel sizing="sm" weight="bold" disabled>
                                    No Headphone
                                </TRLabel>
                                <TRLabel sizing="sm" weight="bold" disabled>
                                    -
                                </TRLabel>
                                <TRBadge
                                    asRoot={
                                        <span>
                                            <LabelRoundBarPercent
                                                height={20}
                                                width={96}
                                                maxGage={10}
                                                gage={0}
                                                sizing="xxs"
                                                asLabel=""
                                            />
                                        </span>
                                    }
                                >
                                    <TRBadge.Item anchorOrigin={{ vertical: 'center', horizon: 'right' }}>
                                        <TRIconButton
                                            sx={{
                                                backgroundColor: `${palette.dark.light} !important`,
                                                transform: 'translate(-3px, 3px)',
                                            }}
                                            disabled
                                            color={palette.text.secondary}
                                            variant="none"
                                            asIcon={<PowerOutlinedIcon />}
                                        />
                                    </TRBadge.Item>
                                </TRBadge>
                            </Column>
                        </>
                    )}
                </Row>
                <Row
                    alignSelf="stretch"
                    justifyContent="space-between"
                    gap={3}
                    sx={{
                        borderBottom: `1px solid ${palette.primary.main}`,
                        p: '20px',
                        backgroundColor: `${palette.primary.main}1f`,
                    }}
                >
                    <Column sx={{ flex: 1 }} alignItems="flex-start">
                        <TRLabel sizing="sm" weight="bold">
                            Daily Earning
                        </TRLabel>
                        <LabelWithGage
                            asLeftLabel={
                                <LabelWithIcon
                                    gap={1}
                                    labelProps={{ sizing: 'xs' }}
                                    label={String(user.availableEnergy)}
                                    asIcon={<EnergyIcon />}
                                />
                            }
                            asRightLabel={<TRLabel sizing="xs">left</TRLabel>}
                            color={palette.primary.light}
                            gage={user.availableEnergyPercent}
                        />
                    </Column>
                    <Column alignSelf="stretch" justifyContent="flex-end" sx={{ flex: 1 }}>
                        <LabelWithGage
                            asLeftLabel={
                                <LabelWithIcon
                                    gap={1}
                                    labelProps={{ sizing: 'xs' }}
                                    label={String(user.remainedTokenEarningLimit)}
                                    asIcon={<BLBIcon />}
                                />
                            }
                            asRightLabel={<TRLabel sizing="xs">/{user.dailyTokenEarningLimit}</TRLabel>}
                            color={palette.primary.light}
                            gage={user.remainTokenEarningPercent}
                        />
                    </Column>
                </Row>
                <Column
                    alignSelf="stretch"
                    sx={{
                        p: '20px',
                        pb: '30px',
                        backgroundColor: `${palette.primary.main}1f`,
                    }}
                    gap={1}
                    alignItems="flex-start"
                >
                    <TRLabel sizing="sm" weight="bold">
                        Mystery box
                    </TRLabel>
                    <Row justifyContent="space-between" style={{ width: '100%' }}>
                        {mysteryBoxes.map((mysteryBox, idx) => (
                            <MysteryboxCard
                                key={idx}
                                item={mysteryBox}
                                onClick={handleMysteryBoxOpenClick(mysteryBox)}
                            />
                        ))}
                    </Row>
                </Column>
            </Column>
            {/* <TRButton
                sx={{ mt: 2 }}
                onClick={() => modalDispatch.open(TEST_MODAL_ID)}
                style={{ width: '100%', height: '56px' }}
            >
                Import wallet
            </TRButton> */}
            {/* <TRButton
                sx={{ mt: 2 }}
                onClick={() =>
                    doEither(
                        () => {
                            console.log('not working');
                        },
                        () => {
                            sendToNative({ name: NATIVE_EVENT.SAVE_PASSCODE, params: { passcode: '111111' } });
                        }
                    )
                }
                style={{ width: '100%', height: '56px' }}
            >
                PASCODE 111111 초기화
            </TRButton> */}
            {headphone instanceof Headphone ? (
                <TRButton
                    sx={{ mt: 'auto', mb: 2, width: '100%' }}
                    variant="contained"
                    style={{ width: '100%', height: '56px' }}
                    onClick={handleGoToPlaylist}
                >
                    Go to Playlist
                </TRButton>
            ) : (
                <TRButton
                    sx={{ mt: 'auto', mb: 2, width: '100%' }}
                    variant="contained"
                    style={{ width: '100%', height: '56px' }}
                    onClick={handleGoToMarketPlace}
                >
                    Go to Marketplace
                </TRButton>
            )}
            <ModalMysteryboxOpen />
            <ModalManageHeadphone />
            <ModalCharge />
            <ModalRegisterQR />
            <ModalGoogleAuthenticaton onSuccess={() => console.log('success')} />
            <ChangeWalletModal />
            <ScreenMysteryBox />
        </>
    );
};

Home.getLayout = (page: React.ReactElement) => (
    <AuthGuard>
        <MainLayout>{page}</MainLayout>
    </AuthGuard>
);

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common'])),
    },
});

export default Home;
