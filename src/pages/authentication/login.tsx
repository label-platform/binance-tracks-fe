import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthenticationLayout } from '@components/authentication/authentication-layout';
import { useMessageDispatch } from 'src/recoil/message';
import { TRInput } from '@components/common/inputs/input';
import { Page } from 'types/page';
import { TRButton } from '@components/common/buttons/button';
import { Column } from '@components/common/flex';
import { useLoginQuery } from 'src/react-query/auth';
import { doEither, sendToNative } from '@utils/native';
import { NATIVE_EVENT } from '@constants/native-event';
import { TokenManagerSingleTon } from '@services/token';
import { InputVerficationCode } from '@components/common/input-verfication-code';

const schema = Yup.object().shape({
    email: Yup.string().required('please input email').email('Please input vaild Email Address.'),
    verificationCode: Yup.string().nullable().length(6, 'Verification Code Error'),
    password: Yup.string()
        .nullable()
        .min(8, 'Password should be at least 8 characters')
        .matches(
            /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$#()^!%*?&])[A-Za-z\d$@$#()^!%*?&]{8,}/,
            'Password must contain special characters and uppercase characters.'
        ),
});

const Login: Page = () => {
    const [isAccountLogin, setIsAccountLogin] = useState(true);
    const router = useRouter();
    const { loginByPassword, loginByVcode } = useLoginQuery();

    const { message } = useMessageDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
        getValues,
        setError,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: '',
            verificationCode: null,
        },
    });

    const toggleAccountLogin = () => {
        setIsAccountLogin(!isAccountLogin);
        reset({
            ...getValues(),
            verificationCode: null,
            password: null,
        });
    };

    const doLoginByPassword = (form: any) => {
        loginByPassword.mutate(form, {
            onSuccess(data) {
                const {
                    content: { userData, accessToken, refreshToken },
                } = data;
                TokenManagerSingleTon.getInstance().init(accessToken, refreshToken);
                if (userData.activationCodeId === null) {
                    router.push('/authentication/activation-code');
                    return;
                }
                doEither(
                    () => {
                        router.push('/');
                    },
                    () => {
                        sendToNative({
                            name: NATIVE_EVENT.LOGIN,
                            params: { user: { ...userData }, accessToken, refreshToken },
                        });
                    }
                );
            },
            onError() {
                setError('password', { message: 'password is invalied' }, { shouldFocus: true });
            },
        });
    };

    const doLoginByVcode = (form: any) => {
        loginByVcode.mutate(form, {
            onSuccess(data) {
                const {
                    content: { userData, accessToken, refreshToken },
                } = data;
                TokenManagerSingleTon.getInstance().init(accessToken, refreshToken);
                if (userData.activationCodeId === null) {
                    router.push('/authentication/activation-code');
                    return;
                }
                doEither(
                    () => {
                        router.push({
                            pathname: '/',
                        });
                    },
                    () => {
                        sendToNative({
                            name: NATIVE_EVENT.LOGIN,
                            params: { user: { ...userData }, accessToken, refreshToken },
                        });
                    }
                );
            },
            onError() {
                setError('verificationCode', { message: 'Verification Code Error' }, { shouldFocus: true });
            },
        });
    };

    const connectSubmit = async (form) => {
        try {
            if (isAccountLogin) {
                doLoginByPassword(form);
                return;
            }
            doLoginByVcode(form);
        } catch (err: any) {
            message.none('error has been occured');
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
                <TRInput
                    data-test-id="email"
                    type="email"
                    {...register('email')}
                    errors={errors.email}
                    helperText="E-mail"
                    style={{
                        marginBottom: '42px',
                    }}
                    inputStyle={{
                        width: '100%',
                    }}
                />
                <>
                    {!isAccountLogin ? (
                        <InputVerficationCode
                            email={getValues('email')}
                            data-test-id="verification-code"
                            type="number"
                            sx={{ width: '100%' }}
                            helperText="E-mail verification code"
                            errors={errors.verificationCode}
                            {...register('verificationCode')}
                        />
                    ) : (
                        <TRInput
                            data-test-id="password"
                            helperText="Password"
                            type="password"
                            inputStyle={{ width: '100%' }}
                            errors={errors.password}
                            {...register('password')}
                        />
                    )}
                </>
            </Column>
            <Column>
                <TRButton
                    data-test-id="login-btn"
                    sx={{ marginBottom: '20px' }}
                    sizing="xl"
                    type="submit"
                    disabled={!isValid || !isDirty}
                    onClick={handleSubmit(connectSubmit)}
                >
                    Log In
                </TRButton>
                <TRButton
                    data-test-id="toggle-login-type-btn"
                    sx={{ marginBottom: '20px' }}
                    sizing="xl"
                    type="submit"
                    variant="text"
                    onClick={toggleAccountLogin}
                >
                    {!isAccountLogin ? 'Account Login' : 'Verification Login'}
                </TRButton>
                {/* <Link href="signup">
                    <a style={{ color: 'white' }}>Sign up</a>
                </Link> */}
            </Column>
        </>
    );
};

Login.getLayout = (page: React.ReactElement) => <AuthenticationLayout>{page}</AuthenticationLayout>;

export default Login;
