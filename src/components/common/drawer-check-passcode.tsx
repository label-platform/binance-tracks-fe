import { DRAWER_ID } from '@constants/common';
import { LISTEN_EVENT, NATIVE_EVENT } from '@constants/native-event';
import { doEither, sendToNative, useListenNativeEvent } from '@utils/native';
import { useEffect, useState } from 'react';
import { useDrawerState } from 'src/recoil/drawer';
import { Drawer } from './drawer';
import { Column } from './flex';
import { TRLabel } from './labels/label';
import { Passcode, usePasscode } from './passcode';
import { ChevronLeft } from '@mui/icons-material';
import { HeaderDrawer } from '@components/common/header-drawer';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';

const TEMP_PASSCODE = '123456';

interface Props {
    handleSuccess?: () => void;
    handleFail?: () => void;
    title?: string;
}

export function DrawerCheckPasscode(props: Props) {
    const { handleFail, handleSuccess, title } = props;
    const passcode = usePasscode();
    const [notMatched, setNotMatched] = useState(false);
    const isVisible = useDrawerState(DRAWER_ID.CHECK_PASSCODE);
    const drawerDispatch = useDrawerDispatch();

    useEffect(() => {
        if (!isVisible) {
            passcode.reset();
        }
    }, [isVisible]);

    useListenNativeEvent(
        ({ data }) => {
            switch (data.type) {
                case LISTEN_EVENT.CHECK_PASSCODE: {
                    if (data.params.isCorrect) {
                        setNotMatched(false);
                        if (typeof handleSuccess === 'function') handleSuccess();
                    } else {
                        setNotMatched(true);
                        if (typeof handleFail === 'function') handleFail();
                    }
                    break;
                }
            }
        },
        [isVisible]
    );

    useEffect(() => {
        if (passcode.passcode.length === 6) {
            doEither(
                () => {
                    if (passcode.passcode.join('') === TEMP_PASSCODE) {
                        if (typeof handleSuccess === 'function') {
                            handleSuccess();
                        }
                    } else {
                        if (typeof handleFail === 'function') handleFail();
                        setNotMatched(true);
                    }
                },
                () => {
                    sendToNative({
                        name: NATIVE_EVENT.CHECK_PASSCODE,
                        params: { passcode: passcode.passcode.join('') },
                    });
                }
            );
        }
    }, [passcode.passcode.length]);

    const handleClose = () => {
        drawerDispatch.close(DRAWER_ID.CHECK_PASSCODE);
    };
    return (
        <Drawer from="right" widthPercent={100} drawerID={DRAWER_ID.CHECK_PASSCODE}>
            <DrawerLayout isNoBottomBar>
                <HeaderDrawer asLeftIcon={<ChevronLeft onClick={handleClose} sx={{ fill: 'white' }} />} title={title} />
                <Column>
                    {!notMatched ? (
                        <TRLabel weight="bold" sizing="ml" style={{ marginBottom: '24px' }}>
                            Enter your passcode
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
