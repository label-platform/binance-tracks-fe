import { AuthGuard } from '@components/authentication/auth-guard';
import { TRButton } from '@components/common/buttons/button';
import { Column, Row } from '@components/common/flex';
import { HeaderDrawer } from '@components/common/header-drawer';
import { TRLabel } from '@components/common/labels/label';
import { MainLayout } from '@components/common/layouts/main-layout';
import { TRToggle } from '@components/common/toggle';
import { ActivationCodeDrawer } from '@components/profile/activation-code-drawer';
import { GoogleAuthenticationConfirmDrawer } from '@components/profile/google-authentication-confirm-drawer';
import { GoogleAuthenticationCreateDrawer } from '@components/profile/google-authentication-create-drawer';
import { GoogleAuthenticationDrawer } from '@components/profile/google-authentication-drawer';
import { ProfileUserDetailDrawer } from '@components/profile/profile-user-detail-drawer';
import { APP_VERSION, DRAWER_ID } from '@constants/common';
import { NATIVE_EVENT } from '@constants/native-event';
import { useTheme } from '@emotion/react';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { TokenManagerSingleTon } from '@services/token';
import { core } from '@utils/core/core';
import { doEither, sendToNative } from '@utils/native';
import Image from 'next/image';
import { useSetOtpEnable } from 'src/react-query/auth';
import { useUserSelfInfoQuery } from 'src/react-query/user';
import { useDrawerDispatch } from 'src/recoil/drawer';

const Profile = () => {
    const { user, isLoading } = useUserSelfInfoQuery();
    const { palette } = useTheme();
    const { mutate } = useSetOtpEnable();
    const { open } = useDrawerDispatch();
    const router = useTracksRouter();

    const handleGoBackClick = () => {
        doEither(
            () => {
                router.back();
            },
            () => {
                sendToNative({ name: NATIVE_EVENT.BACK });
            }
        );
    };

    const handleUserDetailClick = () => {
        open(DRAWER_ID.MY_PROFILE_USER_DETAIL);
    };

    const handleActivationCodeClick = () => {
        open(DRAWER_ID.MY_PROFILE_ACTIVATION_CODE);
    };

    const handleOtpOpenClick = () => {
        open(DRAWER_ID.GOOGLE_AUTHENTICATOR);
    };

    const handleOtpEnableClick = (enable: boolean) => {
        mutate(enable);
    };

    const handleLogoutClick = async () => {
        try {
            await core.auth.logout();
        } finally {
            doEither(
                () => {
                    router.replace('/');
                    TokenManagerSingleTon.getInstance().clear();
                },
                () => {
                    sendToNative({
                        name: NATIVE_EVENT.EXPIRED_TOKEN,
                    });
                }
            );
        }
    };

    if (isLoading) {
        return (
            <Column style={{ width: '100%' }} gap={2}>
                <Row alignSelf="stretch" gap={1}>
                    <Skeleton height={40} sx={{ flex: 1 }} variant="rounded" />
                </Row>
                <Row alignSelf="stretch" gap={1}>
                    <Skeleton height={100} sx={{ flex: 1 }} variant="rounded" />
                </Row>
                <Row alignSelf="stretch" gap={1}>
                    <Skeleton height={80} sx={{ flex: 1 }} variant="rounded" />
                </Row>
                <Row alignSelf="stretch" gap={1}>
                    <Skeleton height={80} sx={{ flex: 1 }} variant="rounded" />
                </Row>
                <Row alignSelf="stretch" gap={1}>
                    <Skeleton height={80} sx={{ flex: 1 }} variant="rounded" />
                </Row>
            </Column>
        );
    }

    return (
        <>
            <Column justifyContent="flex-start" sx={{ height: '100%' }}>
                <HeaderDrawer
                    style={{ marginBottom: 30 }}
                    asLeftIcon={<ChevronLeft onClick={handleGoBackClick} sx={{ fill: 'white' }} />}
                    title="MyPage"
                />
                <Row
                    alignSelf="stretch"
                    justifyContent="flex-start"
                    sx={{ border: `1px solid ${palette.primary.main}`, padding: 2, borderRadius: 1 }}
                    gap={1}
                    onClick={handleUserDetailClick}
                >
                    <Image
                        src="/images/temp-profile.png"
                        alt=""
                        width={32}
                        height={32}
                        style={{ borderRadius: '48px' }}
                    />
                    <Column alignItems="flex-start">
                        <TRLabel weight="bold">{user.name}</TRLabel>
                        <TRLabel sizing="xs" color={palette.text.secondary}>
                            {user.email}
                        </TRLabel>
                    </Column>
                    <ChevronRight color="primary" sx={{ ml: 'auto' }} />
                </Row>
                <Row
                    onClick={handleActivationCodeClick}
                    sx={{ py: 2, px: 1 }}
                    alignSelf="stretch"
                    justifyContent="space-between"
                >
                    <TRLabel>Activation Code</TRLabel>
                    <Row gap={1}>
                        <TRLabel weight="bold">{user.activationCodesLength}</TRLabel>
                        <ChevronRight color="primary" sx={{ width: 16, height: 16 }} />
                    </Row>
                </Row>
                <Row sx={{ py: 2, px: 1 }} alignSelf="stretch" justifyContent="space-between">
                    <TRLabel>Google Authenticator</TRLabel>
                    {user.isOTPRegistered ? (
                        <TRToggle isOn={user.isOTPEnabled} setIsOn={handleOtpEnableClick} />
                    ) : (
                        <TRLabel color="primary" weight="bold" onClick={handleOtpOpenClick}>
                            Link
                        </TRLabel>
                    )}
                </Row>
                <Row sx={{ py: 2, px: 1 }} alignSelf="stretch" justifyContent="space-between">
                    <TRLabel color={palette.text.secondary}>Version</TRLabel>
                    <TRLabel sizing="sm" color={palette.text.secondary}>
                        {APP_VERSION}
                    </TRLabel>
                </Row>
                <Row alignSelf="stretch" sx={{ mt: 'auto', mb: 2 }}>
                    <TRButton onClick={handleLogoutClick} sizing="xl" variant="text">
                        Logout
                    </TRButton>
                </Row>
            </Column>
            <ProfileUserDetailDrawer />
            <ActivationCodeDrawer />
            <GoogleAuthenticationDrawer />
            <GoogleAuthenticationCreateDrawer />
            <GoogleAuthenticationConfirmDrawer />
        </>
    );
};

Profile.getLayout = (page: React.ReactElement) => (
    <AuthGuard>
        <MainLayout>{page}</MainLayout>
    </AuthGuard>
);

export default Profile;
