import { Close } from '@mui/icons-material';
import { Modal } from '@components/common/modals/modal';
import { TRButton } from '@components/common/buttons/button';
import { useModalDispatch, useModalState } from 'src/recoil/modal';
import { useEffect, useState } from 'react';
import { MODAL_ID } from '@constants/common';
import { Column } from '@components/common/flex/index';
import { useTheme } from '@emotion/react';
import { TRLabel } from '@components/common/labels/label';
import { InputWithAdorments } from '@components/common/inputs/input-with-adorments';
import { useMessageDispatch } from 'src/recoil/message';
import { useConfirmOTP } from 'src/react-query/auth';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface Props {
    onSuccess: () => void;
}

const schema = Yup.object().shape({
    authenticatorCode: Yup.string().required('please input this code').length(6, 'invalid code'),
});

export function ModalGoogleAuthenticaton({ onSuccess }: Props) {
    const { close } = useModalDispatch();
    const theme = useTheme();
    const { visible } = useModalState(MODAL_ID.GOOGLE_AUTHENTICATOR_MODAL);

    const { mutate } = useConfirmOTP();
    const { message } = useMessageDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        reset,
        setError,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            authenticatorCode: '',
        },
    });

    useEffect(() => {
        if (!visible) reset();
    }, [visible]);

    const handleConfirmClick = (form) => {
        mutate(
            { code: form.authenticatorCode },
            {
                onSuccess(data) {
                    if (data.validCode) {
                        onSuccess();
                        close(MODAL_ID.GOOGLE_AUTHENTICATOR_MODAL);
                        message.success('Transaction Completed');
                        return;
                    }
                    setError('authenticatorCode', { message: 'code is invalid' });
                },
                onError() {
                    message.none('Error has been occurred');
                },
            }
        );
    };

    const pasteText = async () => {
        const text = await navigator.clipboard?.readText();
        if (isNaN(Number(text))) {
            message.error('숫자 입력하세요');
        } else if (text.length > 6) {
            message.error('숫자가 많음');
        } else {
            setValue('authenticatorCode', text);
        }
    };

    return (
        <>
            <Modal
                asTitle="Google Authenticator"
                modalID={MODAL_ID.GOOGLE_AUTHENTICATOR_MODAL}
                asCloseIcon={<Close />}
                asFooter={
                    <Column style={{ width: '100%' }}>
                        <TRButton
                            style={{ width: '100%' }}
                            onClick={handleSubmit(handleConfirmClick)}
                            disabled={!isValid}
                        >
                            Confirm
                        </TRButton>
                    </Column>
                }
            >
                <Column gap="32px" style={{ margin: '32px 0px' }}>
                    <Column gap="8px">
                        <TRLabel color={theme.palette.text.secondary} sizing="sm" style={{ textAlign: 'center' }}>
                            Enter the 6-digit code <br /> from Google Authenticator.
                        </TRLabel>
                        <InputWithAdorments
                            type="number"
                            inputStyle={{ width: '100%' }}
                            {...register('authenticatorCode')}
                            errors={errors.authenticatorCode}
                            asEnd={
                                <TRLabel weight="bold" color="primary" sizing="sm" onClick={pasteText}>
                                    Paste
                                </TRLabel>
                            }
                        />
                    </Column>
                </Column>
            </Modal>
        </>
    );
}
