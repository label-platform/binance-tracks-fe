import { TRButton } from '@components/common/buttons/button';
import { Drawer } from '@components/common/drawer';
import { Column, Row } from '@components/common/flex';
import { HeaderDrawer } from '@components/common/header-drawer';
import { InputVerficationCode } from '@components/common/input-verfication-code';
import { InputWithAdorments } from '@components/common/inputs/input-with-adorments';
import { TRLabel } from '@components/common/labels/label';
import { DRAWER_ID } from '@constants/common';
import { useTheme } from '@emotion/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChevronLeft } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useConfirmEmailWithOTPQuery } from 'src/react-query/auth';
import { useUserSelfInfoQuery } from 'src/react-query/user';
import { useDrawerDispatch, useDrawerState } from 'src/recoil/drawer';
import { useMessageDispatch } from 'src/recoil/message';
import { RestoreSeedWrite } from './restore-wallet-seed-write';
import * as Yup from 'yup';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';

const schema = Yup.object().shape({
    verificationCode: Yup.string().required('please input this code').length(6, 'invalid code'),
    // authenticatorCode: Yup.string().required('please input this code').length(6, 'invalid code'),
});

interface Prop {
    title: string;
}
export function RestoreConfirm(props: Prop) {
    const { title } = props;
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
            // authenticatorCode: '',
        },
    });
    const visible = useDrawerState(DRAWER_ID.RESTORE_WALLET_CONFIRM);
    // const { palette } = useTheme();
    const { message } = useMessageDispatch();
    const drawerDispatch = useDrawerDispatch();
    const { user } = useUserSelfInfoQuery();
    const { mutate } = useConfirmEmailWithOTPQuery();
    // const handlePasteClick = async () => {
    //     const code = await navigator.clipboard?.readText();
    //     if (isNaN(Number(code))) {
    //         message.error('숫자 입력하세요');
    //     } else if (code.length > 6) {
    //         message.error('숫자가 많음');
    //     } else {
    //         setValue('authenticatorCode', code);
    //     }
    // };

    const handleCloseClick = () => {
        drawerDispatch.close(DRAWER_ID.RESTORE_WALLET_CONFIRM);
    };

    const handleLinkClick = (form) => {
        mutate(
            {
                // code: form.authenticatorCode,
                otp: form.verificationCode,
                email: user.email,
            },
            {
                onSuccess() {
                    drawerDispatch.open(DRAWER_ID.RESTORE_WALLET_SEED_WRITE);
                },
                onError() {
                    message.none('code is invalied');
                },
            }
        );
    };

    return (
        <Drawer paperSx={{ alignItems: 'center' }} widthPercent={100} drawerID={DRAWER_ID.RESTORE_WALLET_CONFIRM}>
            <DrawerLayout isNoBottomBar>
                {visible ? (
                    <Column height="100%" width="100%">
                        <HeaderDrawer
                            asLeftIcon={<ChevronLeft onClick={handleCloseClick} sx={{ fill: 'white' }} />}
                            title={title}
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
                        {/* <Row sx={{ mb: 2 }} alignSelf="stretch">
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
                                placeholder={!user.isOTPEnabled ? 'Please enable Google OTP first' : undefined}
                                disabled={!user.isOTPEnabled}
                                errors={errors.authenticatorCode}
                                {...register('authenticatorCode')}
                            />
                        </Row> */}
                        <TRButton
                            disabled={!isValid}
                            onClick={handleSubmit(handleLinkClick)}
                            style={{
                                width: '100%',
                                height: '56px',
                                padding: '16px',
                                marginBottom: '16px',
                                marginTop: 'auto',
                            }}
                        >
                            Check the Code
                        </TRButton>
                    </Column>
                ) : null}
            </DrawerLayout>
            <RestoreSeedWrite />
        </Drawer>
    );
}
