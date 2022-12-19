import { TRButton } from '@components/common/buttons/button';
import { Drawer } from '@components/common/drawer';
import { Column, Row } from '@components/common/flex';
import { HeaderDrawer } from '@components/common/header-drawer';
import { InputVerficationCode } from '@components/common/input-verfication-code';
import { InputWithAdorments } from '@components/common/inputs/input-with-adorments';
import { TRLabel } from '@components/common/labels/label';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';
import { DRAWER_ID } from '@constants/common';
import { useTheme } from '@emotion/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useClipboard } from '@hooks/use-clipboard';
import { ChevronLeft } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useConfirmOTPBeforeRegiserQuery } from 'src/react-query/auth';
import { useUserSelfInfoQuery } from 'src/react-query/user';
import { useDrawerDispatch, useDrawerState } from 'src/recoil/drawer';
import { useMessageDispatch } from 'src/recoil/message';
import * as Yup from 'yup';

const schema = Yup.object().shape({
    verificationCode: Yup.string().required('please input this code').length(6, 'invalid code'),
    authenticatorCode: Yup.string().required('please input this code').length(6, 'invalid code'),
});

export function GoogleAuthenticationConfirmDrawer() {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            verificationCode: '',
            authenticatorCode: '',
        },
    });
    const visible = useDrawerState(DRAWER_ID.GOOGLE_AUTHENTICATOR_CONFIRM);
    const { palette } = useTheme();
    const { message } = useMessageDispatch();
    const { close, closeAll } = useDrawerDispatch();
    const { user } = useUserSelfInfoQuery();
    const { mutate } = useConfirmOTPBeforeRegiserQuery();
    const { read } = useClipboard();

    const handlePasteClick = () => {
        read({
            onFinish(code) {
                if (isNaN(Number(code))) {
                    message.error('숫자 입력하세요');
                } else if (code.length > 6) {
                    message.error('숫자가 많음');
                } else {
                    setValue('authenticatorCode', code);
                }
            },
        });
    };

    const handleCloseClick = () => {
        close(DRAWER_ID.GOOGLE_AUTHENTICATOR_CONFIRM);
    };

    const handleLinkClick = (form) => {
        mutate(
            {
                code: form.authenticatorCode,
                otp: form.verificationCode,
                email: user.email,
            },
            {
                onSuccess() {
                    message.none('Successfully Set');
                    closeAll();
                },
                onError() {
                    message.none('code is invalied');
                },
            }
        );
    };

    return (
        <Drawer paperSx={{ alignItems: 'center' }} widthPercent={100} drawerID={DRAWER_ID.GOOGLE_AUTHENTICATOR_CONFIRM}>
            {visible ? (
                <DrawerLayout>
                    <HeaderDrawer
                        asLeftIcon={<ChevronLeft onClick={handleCloseClick} sx={{ fill: 'white' }} />}
                        title="Confirm"
                    />
                    <Row sx={{ mb: 2 }} alignSelf="stretch">
                        <InputVerficationCode
                            email={user.email}
                            data-test-id="verification-code"
                            type="number"
                            sx={{ width: '100%' }}
                            helperText="E-mail verification code"
                            errors={errors.verificationCode}
                            {...register('verificationCode')}
                        />
                    </Row>
                    <Row sx={{ mb: 2 }} alignSelf="stretch">
                        <InputWithAdorments
                            data-test-id="authenticator-code"
                            type="number"
                            asEnd={
                                <TRLabel
                                    color={palette.primary.light}
                                    data-test-id="send-btn"
                                    weight="bold"
                                    sizing="xs"
                                    style={{ whiteSpace: 'nowrap' }}
                                    onClick={handlePasteClick}
                                >
                                    Paste
                                </TRLabel>
                            }
                            sx={{ width: '100%' }}
                            helperText="Google Authenticator Code"
                            errors={errors.authenticatorCode}
                            {...register('authenticatorCode')}
                        />
                    </Row>
                    <Row alignSelf="stretch" sx={{ mt: 'auto', mb: 2 }}>
                        <TRButton disabled={!isValid} onClick={handleSubmit(handleLinkClick)} sizing="xl">
                            Link
                        </TRButton>
                    </Row>
                </DrawerLayout>
            ) : null}
        </Drawer>
    );
}
