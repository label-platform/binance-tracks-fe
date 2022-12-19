import { Drawer } from '@components/common/drawer';
import { Column } from '@components/common/flex';
import { TRLabel } from '@components/common/labels/label';
import { Passcode } from '@components/common/passcode';
import { DRAWER_ID } from '@constants/common';
import { NATIVE_EVENT } from '@constants/native-event';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { doEither, sendToNative } from '@utils/native';
import { useEffect, useMemo } from 'react';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { ChevronLeft, Close } from '@mui/icons-material';
import { HeaderDrawer } from '@components/common/header-drawer';
import { useMessageDispatch } from 'src/recoil/message';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';

interface Props {
    originalPasscode: any;
    passcode: any;
    successFunc?: () => void;
}
export function RecheckPasscodeDrawer(props: Props) {
    const { passcode, originalPasscode, successFunc } = props;
    const drawerDispatch = useDrawerDispatch();
    const router = useTracksRouter();
    const { message } = useMessageDispatch();

    const isMatch = useMemo(() => {
        if (passcode.passcode.length === 6) {
            return passcode.passcode.every((num, index) => originalPasscode.passcode[index] === num);
        }
        return true;
    }, [originalPasscode.passcode, passcode.passcode]);

    useEffect(() => {
        if (isMatch && passcode.passcode.length === 6) {
            doEither(
                () => {
                    if (router.pathname !== '/wallet') router.push('/');
                },
                () => {
                    sendToNative({
                        name: NATIVE_EVENT.SAVE_PASSCODE,
                        params: { passcode: passcode.passcode.join('') },
                    });
                    if (router.pathname !== '/wallet') router.push('/');
                }
            );
            if (router.pathname === '/wallet') {
                drawerDispatch.closeAll();
                message.success('Passcode updated Successfully');
            } else {
                drawerDispatch.closeAll();
            }
            if (successFunc) {
                successFunc();
            }
        }
    }, [isMatch, passcode.passcode]);

    const handleClose = () => {
        drawerDispatch.close(DRAWER_ID.CREATE_PASSCODE_RECHECK);
    };

    return (
        <Drawer from="right" widthPercent={100} drawerID={DRAWER_ID.CREATE_PASSCODE_RECHECK}>
            <DrawerLayout isNoBottomBar>
                <HeaderDrawer
                    asLeftIcon={<ChevronLeft onClick={handleClose} sx={{ fill: 'white' }} />}
                    title="Secured Wallet"
                />
                <Column>
                    {isMatch ? (
                        <TRLabel weight="bold" sizing="ml" style={{ marginBottom: '24px' }}>
                            Re-enter your passcode
                        </TRLabel>
                    ) : (
                        <TRLabel weight="bold" color="error" sizing="ml" style={{ marginBottom: '24px' }}>
                            Passcode doesn’t match. Try Again.
                        </TRLabel>
                    )}

                    <Passcode {...passcode} />
                </Column>
            </DrawerLayout>
        </Drawer>
    );
}
