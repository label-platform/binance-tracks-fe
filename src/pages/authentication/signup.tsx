import { AuthenticationLayout } from '@components/authentication/authentication-layout';
import { TRButton } from '@components/common/buttons/button';
import { Column } from '@components/common/flex';
import { TRCheckbox } from '@components/common/inputs/checkbox';
import { TRInput } from '@components/common/inputs/input';
import { InputWithAdorments } from '@components/common/inputs/input-with-adorments';
import { TRLabel } from '@components/common/labels/label';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCountdown } from '@hooks/use-countdown';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const schema = Yup.object().shape({
    email: Yup.string().required('please input email').email('Please input vaild Email Address.'),
    verificationCode: Yup.string().length(6, 'Verification Code Error'),
    nickname: Yup.string().required(),
    agree: Yup.boolean().oneOf([true], 'Confirm the Terms of Use & Privacy Policy'),
});

export default function SignUp() {
    const {
        register,
        formState: { errors, isValid },
        getFieldState,
        trigger,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            nickname: '',
            verificationCode: '',
            agree: false,
        },
    });
    const countdown = useCountdown({ defaultSecond: 60 });
    const handleSendVarificationCodeClick = async () => {
        await trigger('email');
        const { error } = getFieldState('email');
        if (error) {
            // message.error('email is invalid');
            return;
        }
        // sendToEmail(getValues('email'));
    };
    return (
        <AuthenticationLayout>
            <>
                <Column
                    style={{
                        width: '312px',
                        marginBottom: 'auto',
                    }}
                >
                    <TRInput
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

                    <InputWithAdorments
                        style={{ marginBottom: '42px' }}
                        inputStyle={{ width: '100%' }}
                        {...register('verificationCode')}
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
                        type="number"
                        helperText="E-mail verification code"
                        errors={errors.verificationCode}
                        {...register('verificationCode')}
                    />
                    <TRInput
                        style={{ marginBottom: '42px' }}
                        helperText="Nickname"
                        inputStyle={{
                            width: '100%',
                        }}
                        {...register('nickname')}
                    />
                    <TRCheckbox
                        {...register('agree')}
                        asLabel={
                            <TRLabel style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                                I agree to TRACKS’ <TRLabel color="primary">Terms of Use & Privacy Policy</TRLabel>
                            </TRLabel>
                        }
                    />
                </Column>
                <Column>
                    <TRButton
                        sx={{ marginBottom: '20px' }}
                        sizing="xl"
                        type="submit"
                        disabled={!isValid}
                        onClick={() => {
                            console.log('가입');
                        }}
                    >
                        Make An Account
                    </TRButton>
                    <Link href="login">
                        <a style={{ color: 'white' }}>Back to Log in</a>
                    </Link>
                </Column>
            </>
        </AuthenticationLayout>
    );
}
