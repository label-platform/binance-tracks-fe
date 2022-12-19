import React, { useState, useEffect } from 'react';
import { DRAWER_ID } from '@constants/common';
import { Drawer } from '@components/common/drawer';
import { Column, Row } from '@components/common/flex';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { HeaderDrawer } from '@components/common/header-drawer';
import { ChevronLeft } from '@mui/icons-material';
import { TRInput } from '@components/common/inputs/input';
import { TRButton } from '@components/common/buttons/button';
import { TRInputTextArea } from '@components/common/inputs/input-text-area';
import { getPluginByType } from '@services/wallet/plugins';
import { sendToNative } from '@utils/native';
import { NATIVE_EVENT } from '@constants/native-event';
import { useUserRegistWalletAddress } from 'src/react-query/user';
import { useMessageDispatch } from 'src/recoil/message';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';
import { usePasscode } from '@components/common/passcode';
import { CreatePasscodeDrawer } from '@components/authentication/create-passcode/create-passcode-drawer';
import { RecheckPasscodeDrawer } from '@components/authentication/create-passcode/recheck-passcode-drawer';

export const RestoreSeedWrite = () => {
    const [mnemonics, setMnemonics] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const drawerDispatch = useDrawerDispatch();
    const { mutate } = useUserRegistWalletAddress();
    const { message } = useMessageDispatch();
    const passcode = usePasscode();
    const recheckPasscode = usePasscode();
    const handleCloseButton = () => {
        drawerDispatch.close(DRAWER_ID.RESTORE_WALLET_SEED_WRITE);
    };
    const handleInputSeed = (e: any) => {
        setMnemonics(e.target.value);
    };
    useEffect(() => {
        if (passcode.passcode.length === 6) {
            drawerDispatch.close(DRAWER_ID.CREATE_PASSCODE);
            drawerDispatch.open(DRAWER_ID.CREATE_PASSCODE_RECHECK);
        }
    }, [passcode.passcode, recheckPasscode.passcode]);

    const handleInportWallet = async () => {
        const isMatched = mnemonics.split(' ').length === 12;
        if (isMatched) {
            setErrorMessage('');
            try {
                const result = await getPluginByType('ethereum').createWalletByMnemonic(mnemonics.split(' ').join(' '));
                mutate(result.address, {
                    onSuccess() {
                        sendToNative({
                            name: NATIVE_EVENT.SAVE_PRIVATE_KEY,
                            params: { pk: result.keyPair.privateKey, address: result.address },
                        });
                        drawerDispatch.open(DRAWER_ID.CREATE_PASSCODE);
                        message.success('Successfully set');
                    },
                    onError(error) {
                        setErrorMessage('The seed pharase is not correct. Try again.');
                    },
                });
            } catch (error) {
                setErrorMessage('The seed pharase is not correct. Try again.');
            }
        } else {
            setErrorMessage('The seed pharase is not correct. Try again.');
        }
    };
    return (
        <Drawer
            sx={{ px: 3, maxWidth: 360, width: '100%', height: '100%' }}
            drawerID={DRAWER_ID.RESTORE_WALLET_SEED_WRITE}
            from="right"
            widthPercent={100}
            heightPercent={100}
        >
            <DrawerLayout isNoBottomBar>
                <Column width="100%" height="100%">
                    <HeaderDrawer
                        asLeftIcon={<ChevronLeft onClick={handleCloseButton} sx={{ fill: 'white' }} />}
                        title="RestoreWallet"
                    />
                    <Column alignSelf="stretch" width="100%" height="100%" justifyContent="flex-start">
                        <TRInputTextArea
                            fullWidth
                            onChange={handleInputSeed}
                            data-test-id="verification-code"
                            inputStyle={{
                                width: '100%',
                                height: '167px',
                                alignItems: 'flex-start',
                                wordBreak: 'break-all',
                            }}
                            rows={4}
                            multiline
                            helperText="seed phrase"
                            variant="outlined"
                            errors={{ message: errorMessage }}
                        />
                    </Column>
                    <TRButton
                        data-test-id="submit-activation-code"
                        onClick={handleInportWallet}
                        style={{ width: '100%', height: '56px', padding: '16px', marginBottom: '16px' }}
                        type="submit"
                    >
                        Check the Code
                    </TRButton>
                </Column>
            </DrawerLayout>
            <CreatePasscodeDrawer passcode={passcode} />
            <RecheckPasscodeDrawer originalPasscode={passcode} passcode={recheckPasscode} />
        </Drawer>
    );
};
