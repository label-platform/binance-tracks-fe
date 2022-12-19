import { useTheme } from '@emotion/react';
import { useCountdown } from '@hooks/use-countdown';
import { useLoginQuery } from 'src/react-query/auth';
import { InputWithAdorments, InputWithAdormentsProps } from './inputs/input-with-adorments';
import { TRLabel } from './labels/label';
import { Modal } from './modals/modal';
import * as Yup from 'yup';
import { useMessageDispatch } from 'src/recoil/message';
import React from 'react';

interface Props extends Omit<InputWithAdormentsProps, 'asEnd' | 'asStart'> {
    email: string;
}

const schema = Yup.string().required('please input email').email('Please input vaild Email Address.');

export const InputVerficationCode = React.forwardRef((props: Props, ref) => {
    const { email } = props;
    const { sendVcode } = useLoginQuery();
    const countdown = useCountdown({ defaultSecond: 60 });
    const { palette } = useTheme();
    const { message } = useMessageDispatch();

    const sendToEmail = () => {
        sendVcode.mutate(
            { email },
            {
                onSuccess() {
                    countdown.start();
                },
            }
        );
    };

    const handleSendVarificationCodeClick = async () => {
        if (!schema.isValidSync(email)) {
            message.error('email is invalid');
            return;
        }

        Modal.confirm({
            title: 'Code Sent',
            content: 'Please enter the code sent to your email',
            okText: 'Okay',
            handleOkClick: () => {
                sendToEmail();
            },
        });
    };

    return (
        <InputWithAdorments
            ref={ref}
            asEnd={
                countdown.isStart ? (
                    <TRLabel color={palette.primary.light} weight="bold" sizing="xs" style={{ whiteSpace: 'nowrap' }}>
                        {countdown.timer}s
                    </TRLabel>
                ) : (
                    <TRLabel
                        color={palette.primary.light}
                        data-test-id="send-btn"
                        weight="bold"
                        sizing="xs"
                        style={{ whiteSpace: 'nowrap' }}
                        onClick={handleSendVarificationCodeClick}
                    >
                        Send Code
                    </TRLabel>
                )
            }
            {...props}
        />
    );
});
InputVerficationCode.displayName = 'InputVerficationCode';
