import { AuthenticationLayout } from '@components/authentication/authentication-layout';
import { TRButton } from '@components/common/buttons/button';
import { Column } from '@components/common/flex';
import { TRInput } from '@components/common/inputs/input';
import { TRLabel } from '@components/common/labels/label';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Page } from 'types/page';
import * as Yup from 'yup';
import { core } from '@utils/core/core';
import { useUserSelfInfoQuery } from 'src/react-query/user';
import { AuthGuard } from '@components/authentication/auth-guard';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { DRAWER_ID } from '@constants/common';
import { NicknameDrawer } from '@components/authentication/nickname-drawer';
import { useTracksRouter } from '@hooks/use-tracks-router';

const schema = Yup.object().shape({
    activationCode: Yup.string().length(8, 'Activation Code Error'),
});

const ActivationCode: Page = () => {
    const { t } = useTranslation('auth', { keyPrefix: 'activeAccount' });
    const { user } = useUserSelfInfoQuery();
    const drawerDispatch = useDrawerDispatch();
    const {
        register,
        trigger,
        formState: { errors, isValid },
        getFieldState,
        getValues,
        setError,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            activationCode: null,
        },
    });

    const handleEnterClick = async () => {
        await trigger('activationCode');
        const { error } = getFieldState('activationCode');
        if (error) return;
        try {
            const code = getValues('activationCode');
            await core.activationcode.verifyActivationCode(user.email, code);
            drawerDispatch.open(DRAWER_ID.NICKNAME);
        } catch (error) {
            setError('activationCode', {
                message: 'Activation Code Error',
            });
        }
    };

    return (
        <>
            <Column
                style={{
                    width: '312px',
                    marginBottom: 'auto',
                }}
            >
                <TRLabel weight="bold" style={{ fontSize: '24px', margin: '16px 0px' }}>
                    {t('title')}
                </TRLabel>
                <TRLabel style={{ opacity: '0.68', marginBottom: '40px', textAlign: 'center' }}>
                    {t('description')}
                </TRLabel>
                <TRInput
                    data-test-id="activation-code"
                    {...register('activationCode')}
                    errors={errors.activationCode}
                    inputStyle={{ width: '100%' }}
                    helperText="Activation Code"
                />
            </Column>
            <Column>
                <TRButton
                    data-test-id="submit-activation-code"
                    onClick={handleEnterClick}
                    sx={{ marginBottom: '20px' }}
                    sizing="xl"
                    type="submit"
                    disabled={!isValid}
                >
                    Enter
                </TRButton>
                <TRButton sx={{ marginBottom: '20px' }} sizing="xl" variant="outlined">
                    Get a code from Discord
                </TRButton>
                <Link href="login">
                    <a style={{ color: 'white', textDecoration: 'none' }}>Back to Log in</a>
                </Link>
            </Column>
            <NicknameDrawer />
        </>
    );
};

ActivationCode.getLayout = (page: React.ReactElement) => (
    <AuthGuard>
        <AuthenticationLayout>{page}</AuthenticationLayout>
    </AuthGuard>
);
export default ActivationCode;

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['auth'])),
    },
});
