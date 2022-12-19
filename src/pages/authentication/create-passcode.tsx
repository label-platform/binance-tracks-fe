import { AuthGuard } from '@components/authentication/auth-guard';

import { CreatePasscodeDrawer } from '@components/authentication/create-passcode/create-passcode-drawer';
import { RecheckPasscodeDrawer } from '@components/authentication/create-passcode/recheck-passcode-drawer';
import { TRButton } from '@components/common/buttons/button';
import { Column } from '@components/common/flex';
import { InputWithAdorments } from '@components/common/inputs/input-with-adorments';
import { TRLabel } from '@components/common/labels/label';
import { Modal } from '@components/common/modals/modal';
import { usePasscode } from '@components/common/passcode';

import { DRAWER_ID, HTTP_STATUS } from '@constants/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCountdown } from '@hooks/use-countdown';
import { Container } from '@mui/material';
import { core } from '@utils/core/core';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { useUserSelfInfoQuery } from 'src/react-query/user';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { useMessageDispatch } from 'src/recoil/message';
import { Page } from 'types/page';
import * as Yup from 'yup';

const schema = Yup.object().shape({
    verificationCode: Yup.string().length(6, 'Verification Code Error'),
});
const CreatePasscode: Page = () => {
    const { t } = useTranslation('auth', { keyPrefix: 'activeAccount' });
    const { user, refetch } = useUserSelfInfoQuery();
    const countdown = useCountdown({ defaultSecond: 60 });
    const drawerDispatch = useDrawerDispatch();
    const { message } = useMessageDispatch();
    const passcode = usePasscode();
    const recheckPasscode = usePasscode();
    const {
        register,
        formState: { errors, isValid },
        setError,
        handleSubmit,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            verificationCode: null,
        },
    });

    useEffect(() => {
        if (passcode.passcode.length === 6) {
            drawerDispatch.close(DRAWER_ID.CREATE_PASSCODE);
            drawerDispatch.open(DRAWER_ID.CREATE_PASSCODE_RECHECK);
        }
    }, [passcode.passcode, recheckPasscode.passcode]);

    const sendToEmail = (email: string) => {
        core.auth.sendVcode(email);
        countdown.start();
    };

    const handleSendVarificationCodeClick = () => {
        Modal.confirm({
            title: 'Code Sent',
            content: 'Please enter the code sent to your email',
            okText: 'Okay',
            handleOkClick: () => {
                sendToEmail(user.email);
            },
        });
    };

    const connectSubmit = async (form) => {
        try {
            await core.auth.loginByVcode({
                email: user.email,
                otp: form.verificationCode,
            });
            await refetch();
            drawerDispatch.open(DRAWER_ID.CREATE_PASSCODE);
        } catch (error) {
            if (error.code !== HTTP_STATUS.BAD_REQUEST) {
                message.error(error.message);
                return;
            }
            setError('verificationCode', { message: 'Verification Code Error' }, { shouldFocus: true });
        }
    };

    return (
        <>
            <Column style={{ height: '100%' }}>
                <Column
                    style={{
                        width: '312px',
                        marginBottom: 'auto',
                    }}
                >
                    <TRLabel weight="bold" style={{ fontSize: '24px', margin: '16px 0px' }}>
                        {t('title')}
                    </TRLabel>
                    <InputWithAdorments
                        {...register('verificationCode')}
                        errors={errors.verificationCode}
                        inputStyle={{ width: '100%' }}
                        asHelperText={<TRLabel>E-mail Varification Code</TRLabel>}
                        asEnd={
                            countdown.isStart ? (
                                <TRLabel style={{ fontSize: '12px', fontWeight: 700 }}>{countdown.timer}s</TRLabel>
                            ) : (
                                <TRLabel
                                    style={{ fontSize: '12px', fontWeight: 700 }}
                                    onClick={handleSendVarificationCodeClick}
                                >
                                    Send
                                </TRLabel>
                            )
                        }
                    />
                </Column>
                <Column>
                    <TRButton
                        onClick={handleSubmit(connectSubmit)}
                        sx={{ marginBottom: '20px' }}
                        sizing="xl"
                        type="submit"
                        disabled={!isValid}
                    >
                        Check the Code
                    </TRButton>
                </Column>
            </Column>
            <CreatePasscodeDrawer passcode={passcode} />
            <RecheckPasscodeDrawer originalPasscode={passcode} passcode={recheckPasscode} />
        </>
    );
};

CreatePasscode.getLayout = (page) => (
    <AuthGuard>
        <Container style={{ height: '100%' }} maxWidth="sm">
            {page}
        </Container>
    </AuthGuard>
);
export default CreatePasscode;
