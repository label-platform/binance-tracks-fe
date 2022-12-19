import { Drawer } from '@components/common/drawer';
import { Column, Row } from '@components/common/flex';
import { HeaderDrawer } from '@components/common/header-drawer';
import { TRInput } from '@components/common/inputs/input';
import { DRAWER_ID } from '@constants/common';
import { ChevronLeft } from '@mui/icons-material';
import { useUserSelfInfoQuery } from 'src/react-query/user';
import { useDrawerDispatch, useDrawerState } from 'src/recoil/drawer';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { TRButton } from '@components/common/buttons/button';
import { InputWithAdorments } from '@components/common/inputs/input-with-adorments';
import { TRLabel } from '@components/common/labels/label';
import { useUpdatePassword } from 'src/react-query/auth';
import { useTheme } from '@emotion/react';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { useEffect, useState } from 'react';
import { useMessageDispatch } from 'src/recoil/message';
import { InputVerficationCode } from '@components/common/input-verfication-code';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';
import { useClipboard } from '@hooks/use-clipboard';

const schema = Yup.object().shape({
    verificationCode: Yup.string().required('please input this code').length(6, 'invalid code'),
    authenticatorCode: Yup.string().required('please input this code').length(6, 'invalid code'),
    password: Yup.string()
        .required()
        .min(8, 'Password should be at least 8 characters')
        .matches(
            /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$#()^!%*?&])[A-Za-z\d$@$#()^!%*?&]{8,}/,
            'Password must contain special characters and uppercase characters.'
        ),
});

export function ChangePasswordDrawer() {
    const { close } = useDrawerDispatch();
    const visible = useDrawerState(DRAWER_ID.MY_PROFILE_USER_CHANGE_PASSWORD);
    const { user, isLoading } = useUserSelfInfoQuery();
    const [isShowPassword, setIsShowPassword] = useState(true);
    const { palette } = useTheme();
    const { message } = useMessageDispatch();
    const updatePassword = useUpdatePassword();
    const { read } = useClipboard();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            verificationCode: '',
            authenticatorCode: '',
            password: '',
        },
    });

    useEffect(() => {
        if (!visible) {
            reset();
        }
    }, [visible]);

    const handleCloseClick = () => {
        close(DRAWER_ID.MY_PROFILE_USER_CHANGE_PASSWORD);
    };

    const handlePasteClick = async () => {
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

    const handleSaveClick = (form: any) => {
        updatePassword.mutate(
            {
                email: user.email,
                password: form.password,
                vcode: form.verificationCode,
            },
            {
                onSuccess() {
                    message.none('Successfully Set');
                    close(DRAWER_ID.MY_PROFILE_USER_CHANGE_PASSWORD);
                },
                onError() {
                    message.none('Fail to change password, please check your code is valid');
                },
            }
        );
    };

    const handleShowPasswordToggleClick = () => {
        setIsShowPassword((state) => !state);
    };

    return (
        <Drawer
            paperSx={{ alignItems: 'center' }}
            widthPercent={100}
            drawerID={DRAWER_ID.MY_PROFILE_USER_CHANGE_PASSWORD}
        >
            {!isLoading ? (
                <DrawerLayout>
                    <HeaderDrawer
                        asLeftIcon={<ChevronLeft onClick={handleCloseClick} sx={{ fill: 'white' }} />}
                        title="Change Password"
                    />
                    <Row sx={{ mb: 2 }} alignSelf="stretch">
                        <TRInput sx={{ width: '100%' }} helperText="E-mail" disabled value={user.email} />
                    </Row>
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
                            placeholder={!user.isOTPEnabled ? 'Please enable Google OTP first' : undefined}
                            disabled={!user.isOTPEnabled}
                            sx={{ width: '100%' }}
                            helperText="Google Authenticator Code"
                            errors={errors.authenticatorCode}
                            {...register('authenticatorCode')}
                        />
                    </Row>
                    <Row sx={{ mb: 2 }} alignSelf="stretch">
                        <InputWithAdorments
                            data-test-id="password"
                            type={isShowPassword ? 'password' : 'text'}
                            asEnd={
                                <RemoveRedEyeOutlinedIcon
                                    onClick={handleShowPasswordToggleClick}
                                    sx={{ fill: isShowPassword ? 'rgba(255, 255, 255, 0.38)' : palette.primary.main }}
                                />
                            }
                            sx={{ width: '100%' }}
                            helperText="New Password"
                            errors={errors.password}
                            {...register('password')}
                        />
                    </Row>

                    <Row alignSelf="stretch" sx={{ mt: 'auto', mb: 2 }}>
                        <TRButton disabled={!(isDirty && isValid)} onClick={handleSubmit(handleSaveClick)} sizing="xl">
                            Save
                        </TRButton>
                    </Row>
                </DrawerLayout>
            ) : null}
        </Drawer>
    );
}
