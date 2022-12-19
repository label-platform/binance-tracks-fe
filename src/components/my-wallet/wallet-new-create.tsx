import { TRButton } from '@components/common/buttons/button';
import { Drawer } from '@components/common/drawer';
import { Column, Row } from '@components/common/flex';
import { HeaderDrawer } from '@components/common/header-drawer';
import { InputVerficationCode } from '@components/common/input-verfication-code';
import { DRAWER_ID } from '@constants/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChevronLeft } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useConfirmEmailWithOTPQuery } from 'src/react-query/auth';
import { useUserSelfInfoQuery } from 'src/react-query/user';
import { useDrawerDispatch, useDrawerState } from 'src/recoil/drawer';
import { useMessageDispatch } from 'src/recoil/message';
import * as Yup from 'yup';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';
import { usePasscode } from '@components/common/passcode';
import { CreatePasscodeDrawer } from '@components/authentication/create-passcode/create-passcode-drawer';
import { RecheckPasscodeDrawer } from '@components/authentication/create-passcode/recheck-passcode-drawer';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { useEffect } from 'react';
const schema = Yup.object().shape({
    verificationCode: Yup.string().required('please input this code').length(6, 'invalid code'),
});

interface Prop {
    title: string;
}
export function WalletNewCreate(props: Prop) {
    const { title } = props;
    const router = useTracksRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            verificationCode: '',
        },
    });
    const visible = useDrawerState(DRAWER_ID.WALLET_NEW_CREATE);
    const { message } = useMessageDispatch();
    const drawerDispatch = useDrawerDispatch();
    const { user } = useUserSelfInfoQuery();
    const { mutate } = useConfirmEmailWithOTPQuery();
    const passcode = usePasscode();
    const recheckPasscode = usePasscode();
    const handleCloseClick = () => {
        drawerDispatch.close(DRAWER_ID.WALLET_NEW_CREATE);
    };

    useEffect(() => {
        if (passcode.passcode.length === 6) {
            drawerDispatch.close(DRAWER_ID.CREATE_PASSCODE);
            drawerDispatch.open(DRAWER_ID.CREATE_PASSCODE_RECHECK);
        }
    }, [passcode.passcode, recheckPasscode.passcode]);

    const handleLinkClick = (form) => {
        mutate(
            {
                // code: form.authenticatorCode,
                otp: form.verificationCode,
                email: user.email,
            },
            {
                onSuccess() {
                    drawerDispatch.open(DRAWER_ID.CREATE_PASSCODE);
                },
                onError() {
                    message.none('code is invalied');
                },
            }
        );
    };

    return (
        <Drawer
            paperSx={{ alignItems: 'center' }}
            widthPercent={100}
            heightPercent={100}
            drawerID={DRAWER_ID.WALLET_NEW_CREATE}
        >
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
            <CreatePasscodeDrawer passcode={passcode} />
            <RecheckPasscodeDrawer
                originalPasscode={passcode}
                passcode={recheckPasscode}
                successFunc={() => router.push('/authentication/create-wallet')}
            />
        </Drawer>
    );
}
